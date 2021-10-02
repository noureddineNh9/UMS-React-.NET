using Api.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Api.Services
{
    public interface IUserService
    {
        Task<AuthenticateResponse> Login(LoginModel model);
        Task<AuthenticateResponse> refreshToken(string token);
        bool RevokeToken(string token);
        User GetUserFromAccessToken(string accessToken);
    }
    public class UserService : IUserService
    {
        private readonly UserManager<User> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _applicationDbContext;
        private readonly SignInManager<User> _signInManager;
        private readonly IWebHostEnvironment _hostEnvironment;

        public UserService(UserManager<User> userManager, SignInManager<User> signInManager
            , RoleManager<IdentityRole> roleManager, IConfiguration configuration,
            ApplicationDbContext applicationDbContext, IWebHostEnvironment hostEnvironment)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            _configuration = configuration;
            _applicationDbContext = applicationDbContext;
            _signInManager = signInManager;
            _hostEnvironment = hostEnvironment;
        }
        public async Task<AuthenticateResponse> Login(LoginModel model)
        {
            var user = await userManager.FindByNameAsync(model.UserName);

            AuthenticateResponse response = null;

            if (user != null && await userManager.CheckPasswordAsync(user, model.Password))
            {
                await _signInManager.SignInAsync(user, false);
                var roles = userManager.GetRolesAsync(user).Result.ToList();

                var jwtToken = await generateJwtToken(user);
                var refreshToken = generateRefreshToken();

                // save refresh token
                user.RefreshTokens.Add(refreshToken);
                _applicationDbContext.Update(user);
                _applicationDbContext.SaveChanges();
                string imageSrc = user.ImageName;

                response = new AuthenticateResponse(user, jwtToken, refreshToken.Token, imageSrc, roles);
            }

            return response;
        }


        public async Task<AuthenticateResponse> refreshToken(string token)
        {
            var user = _applicationDbContext.Users.SingleOrDefault(u => u.RefreshTokens.Any(t => t.Token == token));
            var roles = userManager.GetRolesAsync(user).Result.ToList();

            // return null if no user found with token
            if (user == null || user.RefreshTokens.Count == 0) return null;

            var refreshToken = user.RefreshTokens.OrderByDescending(rt => rt.Expires)
                                                .FirstOrDefault();

            // return null if token is no longer active
            if (token != refreshToken.Token || !refreshToken.IsActive) return null;

            // replace old refresh token with a new one and save
            var newRefreshToken = generateRefreshToken();
            refreshToken.Revoked = DateTime.UtcNow;
            refreshToken.ReplacedByToken = newRefreshToken.Token;
            user.RefreshTokens.Add(newRefreshToken);
            _applicationDbContext.Update(user);
            _applicationDbContext.SaveChanges();

            // generate new jwt
            var jwtToken = await generateJwtToken(user);

            string imageSrc = user.ImageName;
            return new AuthenticateResponse(user, jwtToken, newRefreshToken.Token, imageSrc, roles);
        }

        private async Task<string> generateJwtToken(User user)
        {
            var userRoles = await userManager.GetRolesAsync(user);
            var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };
            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }
            var authSiginKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration["JWT:Secret"]));
            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddMinutes(1),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSiginKey, SecurityAlgorithms.HmacSha256Signature)
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private RefreshToken generateRefreshToken()
        {
            using (var rngCryptoServiceProvider = new RNGCryptoServiceProvider())
            {
                var randomBytes = new byte[64];
                rngCryptoServiceProvider.GetBytes(randomBytes);
                return new RefreshToken
                {
                    Token = Convert.ToBase64String(randomBytes),
                    Expires = DateTime.UtcNow.AddDays(7),
                    Created = DateTime.UtcNow
                };
            }
        }

        public bool RevokeToken(string token)
        {
            var user = _applicationDbContext.Users.SingleOrDefault(u => u.RefreshTokens.Any(t => t.Token == token));

            // return false if no user found with token
            if (user == null) return false;

            var refreshToken = user.RefreshTokens.Single(x => x.Token == token);

            // return false if token is not active
            if (!refreshToken.IsActive) return false;

            // revoke token and save
            refreshToken.Revoked = DateTime.UtcNow;
            _applicationDbContext.Update(user);
            _applicationDbContext.SaveChanges();

            return true;
        }

        public User GetUserFromAccessToken(string accessToken)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_configuration["JWT:Secret"]);

                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };

                SecurityToken securityToken;
                var principle = tokenHandler.ValidateToken(accessToken, tokenValidationParameters, out securityToken);

                JwtSecurityToken jwtSecurityToken = securityToken as JwtSecurityToken;

                if (jwtSecurityToken != null /*&& jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase)*/)
                {
                    var userName = principle.FindFirst(ClaimTypes.Name)?.Value;

                    return _applicationDbContext.Users.SingleOrDefault(u => u.UserName == userName);
                    //.Include(u => u.Role)
                    //                .Where(u => u.UserId == Convert.ToInt32(userId)).FirstOrDefaultAsync();
                }
            }
            catch (Exception)
            {
                return null;
            }

            return null;
        }

    }
}
