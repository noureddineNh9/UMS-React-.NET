using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {

        private readonly UserManager<User> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _applicationDbContext;
        private readonly SignInManager<User> _signInManager;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly IUserService _userService;

        public UsersController(UserManager<User> userManager, SignInManager<User> signInManager
            , RoleManager<IdentityRole> roleManager , IConfiguration configuration,
            ApplicationDbContext applicationDbContext, IWebHostEnvironment hostEnvironment, IUserService userService)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            _configuration = configuration;
            _applicationDbContext = applicationDbContext;
            _signInManager = signInManager;
            _hostEnvironment = hostEnvironment;
            _userService = userService;
        }


        [HttpPost]
        [Route("RegisterAdmin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterModel model)
        {
            var userExist = await userManager.FindByNameAsync(model.UserName);
            if (userExist != null)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = " User Already Exist" });

            User user = new User
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.UserName
            };

            var result = await userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = $"{result.Errors.ToList()[0].Code}", Message = $"{result.Errors.ToList()[0].Description}" });

            if (!await roleManager.RoleExistsAsync(UserRoles.Admin))
                await roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));


            if (await roleManager.RoleExistsAsync(UserRoles.Admin))
            {
                await userManager.AddToRolesAsync(user, new List<string>() { UserRoles.Admin });
            }

                return Ok(new Response { Status = "Success", Message = "User Created Successfully" });
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var response = await _userService.Login(model);


            if (response == null)
                return Ok(response);
            response.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, response.ImageSrc);
            Token t = new Token() { Name = response.RefreshToken };
            _applicationDbContext.Tokens.Add(t);
            _applicationDbContext.SaveChanges();
            setTokenCookie(response.RefreshToken);

            return Ok(response);
        }

        [HttpPost]
        [Route("Logout")]
        public IActionResult LogOut()
        {
            // accept token from request body or cookie
            var token = _applicationDbContext.Tokens.OrderByDescending(rt => rt.Id)
                                    .FirstOrDefault().Name;

            if (string.IsNullOrEmpty(token))
                return BadRequest(new { message = "Token is required" });

            var response = _userService.RevokeToken(token);

            if (!response)
                return NotFound(new { message = "Token not found" });

            return Ok(new { message = "Token revoked" });
        }




        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            string refreshToken = "";
            //var refreshToken = Request.Cookies["refreshToken"];
            if (_applicationDbContext.Tokens.Count() != 0)
            {
                refreshToken = _applicationDbContext.Tokens.OrderByDescending(rt => rt.Id)
                                                .FirstOrDefault().Name;
            }

            var response = await _userService.refreshToken(refreshToken);

            if (response == null)
                return Ok(response);
            response.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, response.ImageSrc);
            Token t = new Token() { Name = response.RefreshToken };
            _applicationDbContext.Tokens.Add(t);
            _applicationDbContext.SaveChanges();
            setTokenCookie(response.RefreshToken);

            return Ok(response);
        }

        [HttpPost("GetUserByAccessToken")]
        public ActionResult<User> GetUserByAccessToken(string accessToken)
        {
            User user = _userService.GetUserFromAccessToken(accessToken);

            if (user != null)
            {
                return user;
            }

            return null;
        }


        //private bool ValidateRefreshToken(User user, string refreshToken)
        //{

        //    RefreshToken refreshTokenUser = _context.RefreshTokens.Where(rt => rt.Token == refreshToken)
        //                                        .OrderByDescending(rt => rt.ExpiryDate)
        //                                        .FirstOrDefault();

        //    if (refreshTokenUser != null && refreshTokenUser.UserId == user.UserId
        //        && refreshTokenUser.ExpiryDate > DateTime.UtcNow)
        //    {
        //        return true;
        //    }

        //    return false;
        //}




        private void setTokenCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refreshToken", token, cookieOptions);
        }

        [NonAction]
        public async Task<string> SaveImage(IFormFile imageFile)
        {
            string imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName).Take(10).ToArray()).Replace(' ', '-');
            imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(imageFile.FileName);
            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", imageName);
            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }
            return imageName;
        }
    }
}
