using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext( DbContextOptions<ApplicationDbContext> options ) : base(options)
        {
            
        }
        public DbSet<Token> Tokens { get; set; }
        public DbSet<Classe> Classes { get; set; }
        public DbSet<Module> Modules { get; set; }
        public DbSet<Mail> Mails { get; set; }
        public DbSet<FilesDetails> FilesDetails { get; set; }

    }
}
