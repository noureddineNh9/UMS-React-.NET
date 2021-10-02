using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class Module
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public int ClasseId { get; set; }
        public Classe Classe { get; set; }

        public string ProfessorId { get; set; }

    }
}
