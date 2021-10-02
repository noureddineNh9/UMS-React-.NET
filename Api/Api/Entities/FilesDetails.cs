using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class FilesDetails
    {
        public int Id { get; set; }
        [MaxLength(100)]
        public string Name { get; set; }
        [MaxLength(100)]
        public string FileType { get; set; }
        [MaxLength]
        public byte[] DataFiles { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int? ModuleID { get; set; }
        public int? SectionNum { get; set; }
    }
    public class uploadfile
    {
        [NotMapped]
        public IFormFile File { get; set; }
        public int? ModuleID { get; set; }
        public int? SectionNum { get; set; }
    }
    public class ModuleWithFiles
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public int ClasseId { get; set; }
        public Classe Classe { get; set; }

        public string ProfessorId { get; set; }
        public List<FilesDetails> Files { get; set; }
        public ModuleWithFiles(List<FilesDetails> files,Module module)
        {
            Id = module.Id;
            Name = module.Name;
            ClasseId = module.ClasseId;
            Classe = module.Classe;
            ProfessorId = module.ProfessorId;
            Files = files;
        }
    }
}
