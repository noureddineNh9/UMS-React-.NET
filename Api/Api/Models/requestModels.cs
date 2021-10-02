using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class getAllProfessorsModel
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public getAllProfessorsModel(User user)
        {
            Id = user.Id;
            Email = user.Email;
            UserName = user.UserName;
            FirstName = user.FirstName;
            LastName = user.LastName;
        }


    }
    public class updateProfessorsModel
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

    }
}
