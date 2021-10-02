using Api.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _applicationDbContext;

        public StudentController(UserManager<User> userManager, IWebHostEnvironment hostEnvironment,
            RoleManager<IdentityRole> roleManager, ApplicationDbContext applicationDbContext)
        {
            _userManager = userManager;
            _hostEnvironment = hostEnvironment;
            _roleManager = roleManager;
            _applicationDbContext = applicationDbContext;
        }

        [HttpGet]
        [Route("getAll")]
        public ActionResult<IEnumerable<StudentModel>> getAllStudents()
        {
            return _userManager.GetUsersInRoleAsync(UserRoles.Student).Result.Select(user =>
           new StudentModel(user, String.Format("{0}://{1}{2}/Images/{3}",
           Request.Scheme, Request.Host, Request.PathBase, user.ImageName)
           )).ToList();
        }

        [Route("getStudentInfo")]
        public ActionResult<StudentInfoModel> getStudentInfo(string id)
         {
            var user = _applicationDbContext.Users.Include(u => u.Classe).Where(x => x.Id == id).FirstOrDefault();
            var modules = _applicationDbContext.Modules.Where(m => m.ClasseId == user.ClasseId).ToList();
            if (user != null)
                return new StudentInfoModel(user, modules);
            return NotFound();
        }

        [HttpGet("{id}")]
        [Route("getStudent")]
        public ActionResult<StudentModel> getStudent(string id)
        {
            var user = _applicationDbContext.Users.Where(x => x.Id == id).FirstOrDefault();

            if (user != null)
                return new StudentModel(user, String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, user.ImageName));
            return NotFound();
        }


        [HttpPost]
        [Route("Register")]
        public async Task<ActionResult<StudentModel>> RegisterStudent([FromForm] RegisterStudentModel model)
        {
            var userExist = await _userManager.FindByNameAsync(model.UserName);
            if (userExist != null)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User Already Exist" });

            User user = new User
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
                ClasseId = model.classeId,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.UserName,
                ImageName = await SaveImage(model.ImageFile)
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "Failed to register new user" });

            if (!await _roleManager.RoleExistsAsync(UserRoles.Student))
                await _roleManager.CreateAsync(new IdentityRole(UserRoles.Student));

            if (await _roleManager.RoleExistsAsync(UserRoles.Student))
            {
                await _userManager.AddToRolesAsync(user, new List<string>() { UserRoles.Student });
            }

            return new StudentModel(user, String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, user.ImageName));
        }



        [HttpPut("{id}")]
        public async Task<ActionResult<StudentModel>> PutStudent(string id, [FromForm] RegisterStudentModel student)
        {

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.FirstName = student.FirstName;
            user.LastName = student.LastName;
            user.Email = student.Email;
            user.UserName = student.UserName;

            if (student.ImageFile != null)
                user.ImageName = await SaveImage(student.ImageFile);

            var result = _userManager.UpdateAsync(user).Result;

            if (result.Succeeded)
                return new StudentModel(user, String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, user.ImageName));


            return NoContent();
        }


        [HttpPost]
        [Route("updateImage")]
        public async Task<ActionResult<string>> updateImage([FromForm] updateStudentImage model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user == null)
                return NotFound();

            user.ImageName = await SaveImage(model.ImageFile);
            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {

                return String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, user.ImageName);
            }
            else
                return NotFound();
        }

        [NonAction]
        public async Task<string> SaveImage(IFormFile imageFile)
        {
            if (imageFile == null) return "";
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
