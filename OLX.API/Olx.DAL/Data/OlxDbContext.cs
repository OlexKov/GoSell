using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Olx.BLL.Entities;
using System.Reflection;
using Microsoft.Extensions.Configuration;

namespace Olx.DAL.Data
{
    public class OlxDbContext(DbContextOptions<OlxDbContext> options, 
        IConfiguration configuration) : IdentityDbContext<OlxUser, IdentityRole<int>, int>(options)
    {
        public DbSet<Category> Category { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection")!;
            optionsBuilder.UseNpgsql(connectionString);
        }
    }
}
