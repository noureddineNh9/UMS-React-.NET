using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Api.Models;

namespace Api.Models
{
    public class AuthenticateResponse
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string JwtToken { get; set; }
        public string ImageName { get; set; }
        public string ImageSrc { get; set; }
        public List<String> Roles { get; set; }



        [JsonIgnore] // refresh token is returned in http only cookie
        public string RefreshToken { get; set; }

        public AuthenticateResponse(User user, string jwtToken, string refreshToken, string imageSrc,List<String> roles)
        {
            Id = user.Id;
            Email = user.Email;
            UserName = user.UserName;
            JwtToken = jwtToken;
            RefreshToken = refreshToken;
            ImageName = user.ImageName;
            ImageSrc = imageSrc;
            FirstName = user.FirstName;
            LastName = user.LastName;
            Roles = roles;
        }
    }
}