using Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly ApplicationDbContext _applicationDbContext;

        public FilesController(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }

        [HttpGet]
        public ActionResult<List<FilesDetails>> GetFiles(int id)
        {
            var Files = _applicationDbContext.FilesDetails.Where(f => f.ModuleID == id).ToList();
            return Files;
        }

        [HttpPost]
        [Route("uploadFiles")]
        public IActionResult uploadFiles([FromForm] uploadfile model)
        {
            if (model.File != null)
            {
                if (model.File.Length > 0)
                {
                    //Getting FileName
                    var fileName = Path.GetFileName(model.File.FileName);
                    //Getting file Extension
                    var fileExtension = Path.GetExtension(fileName);
                    // concatenating  FileName + FileExtension
                    var newFileName = String.Concat(Convert.ToString(Guid.NewGuid()), fileExtension);

                    var objfiles = new FilesDetails()
                    {
                        Name = fileName,
                        FileType = fileExtension,
                        CreatedOn = DateTime.Now,
                        ModuleID = model.ModuleID,
                        SectionNum = model.SectionNum
                    };

                    using (var target = new MemoryStream())
                    {
                        model.File.CopyTo(target);
                        objfiles.DataFiles = target.ToArray();
                    }

                    _applicationDbContext.FilesDetails.Add(objfiles);
                    _applicationDbContext.SaveChanges();

                }
            }
            return NoContent();
        }

        [HttpGet]
        [Route("DownLoadFile")]
        public FileResult DownLoadFile(int id)
        {


            List<FilesDetails> ObjFiles = _applicationDbContext.FilesDetails.ToList();

            var FileById = (from FC in ObjFiles
                            where FC.Id.Equals(id)
                            select new { FC.Name, FC.DataFiles }).ToList().FirstOrDefault();

            return File(FileById.DataFiles, "application/pdf", FileById.Name);

        }

    }
}
