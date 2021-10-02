using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Models;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ModulesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ModulesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Modules
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Module>>> GetModules()
        {
            return await _context.Modules.Include(module => module.Classe)
                .ToListAsync();
        }
        [HttpGet]
        [Route("GetModulesByProfId")]
        public async Task<ActionResult<IEnumerable<ModuleWithFiles>>> GetModulesByProfId(string id)
        {
            List<ModuleWithFiles> list = new List<ModuleWithFiles>();
            var Modules = await _context.Modules.Include(module => module.Classe).Where(module => module.ProfessorId == id).ToListAsync();
            foreach (var item in Modules)
            {
                var Files = _context.FilesDetails.Where(f => f.ModuleID == item.Id).ToList();
                var m = new ModuleWithFiles(Files, item);
                list.Add(m);
            }
            return list;
            
 
        }

        // GET: api/Modules/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Module>> GetModule(int id)
        {
            var @module = await _context.Modules.FindAsync(id);

            if (@module == null)
            {
                return NotFound();
            }

            return @module;
        }

        // PUT: api/Modules/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<ActionResult<Module>> PutModule(int id, Module @module)
        {
            if (id != @module.Id)
            {
                return BadRequest();
            }

            _context.Entry(@module).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ModuleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            var m = _context.Modules.Include(x => x.Classe).Where(x => x.Id == module.Id).FirstOrDefault();
            return m;
        }

        // POST: api/Modules
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Module>> PostModule(Module @module)
        {
            _context.Modules.Add(@module);
            await _context.SaveChangesAsync();
            var result = _context.Classes.Where(w => w.Id == @module.ClasseId).FirstOrDefault();
            return CreatedAtAction("GetModule", new { id = @module.Id, classeId = module.ClasseId, classe = result }, @module);
        }

        // DELETE: api/Modules/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteModule(int id)
        {
            var @module = await _context.Modules.FindAsync(id);
            if (@module == null)
            {
                return NotFound();
            }

            _context.Modules.Remove(@module);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ModuleExists(int id)
        {
            return _context.Modules.Any(e => e.Id == id);
        }
    }
}
