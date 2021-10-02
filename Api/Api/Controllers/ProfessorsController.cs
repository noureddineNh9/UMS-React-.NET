using Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfessorsController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private RoleManager<IdentityRole> _roleManager;

        public ProfessorsController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpGet]
        [Route("getAll")]
        public ActionResult<List<getAllProfessorsModel>> getAllProfessors()
        {
            var users = _userManager.GetUsersInRoleAsync(UserRoles.Professor).Result.ToList();
            if (users.Count == 0)
                return NotFound();
            return users.Select(user => new getAllProfessorsModel(user)).ToList();
        }

        [HttpGet("{id}")]
        [Route("getProfessor")]
        public ActionResult<getAllProfessorsModel> getProfessor(string id)
        {
            var user = _userManager.GetUsersInRoleAsync(UserRoles.Professor).Result.ToList().Where(x => x.Id == id).FirstOrDefault();

            if (user != null)
                return new getAllProfessorsModel(user);
            return NotFound();
        }

        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> RegisterProfessor([FromBody] RegisterProfessorModel model)
        {
            var userExist = await _userManager.FindByNameAsync(model.UserName);
            if (userExist != null)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = " User Already Exist" });

            User user = new User
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.UserName,
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "Failed to register new user" });

            if (!await _roleManager.RoleExistsAsync(UserRoles.Professor))
                await _roleManager.CreateAsync(new IdentityRole(UserRoles.Professor));

            if (await _roleManager.RoleExistsAsync(UserRoles.Professor))
            {
                await _userManager.AddToRolesAsync(user, new List<string>() { UserRoles.Professor });
            }

            return Ok(new Response { Status = "Success", Message = "User Created Successfully" });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<getAllProfessorsModel>> PutModule(string id, updateProfessorsModel professor)
        {

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.FirstName = professor.FirstName;
            user.LastName = professor.LastName;
            user.Email = professor.Email;
            user.UserName = professor.UserName;

            var result = _userManager.UpdateAsync(user).Result;
            if (result.Succeeded)
                return new getAllProfessorsModel(user);


            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProfessor(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(_userManager.DeleteAsync(user).Result);

        }


    }
}
