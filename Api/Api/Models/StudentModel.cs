using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Api.Models
{
    public class StudentModel
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ImageName { get; set; }
        public string ImageSrc { get; set; }
        public string Password { get; set; }
        public int? classeId { get; set; }
        public Classe classe { get; set; }

        public StudentModel(User user, string? imageSrc)
        {
            Id = user.Id;
            Email = user.Email;
            UserName = user.UserName;
            ImageName = user.ImageName;
            ImageSrc = imageSrc;
            FirstName = user.FirstName;
            LastName = user.LastName;
            classeId = user.ClasseId;
        }
    }

    public class updateStudentImage
    {
        public string UserId { get; set; }
        [NotMapped]
        public IFormFile ImageFile { get; set; }
    }

    public class StudentInfoModel
    {
        public int? classeId { get; set; }
        public Classe classe { get; set; }
        public List<Module> modules { get; set; }


        public StudentInfoModel(User user, List<Module> Modules)
        {
            classeId = user.ClasseId;
            classe = user.Classe;
            modules = Modules;
        }
    }
}
