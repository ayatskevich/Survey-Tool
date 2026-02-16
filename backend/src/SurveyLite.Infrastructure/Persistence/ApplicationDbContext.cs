using Microsoft.EntityFrameworkCore;
using SurveyLite.Domain.Entities;
using SurveyLite.Infrastructure.Persistence.EntityConfigurations;

namespace SurveyLite.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Survey> Surveys => Set<Survey>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<Response> Responses => Set<Response>();
    public DbSet<Answer> Answers => Set<Answer>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        SetTimestamps();
        return await base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        SetTimestamps();
        return base.SaveChanges();
    }

    private void SetTimestamps()
    {
        var entries = ChangeTracker.Entries().Where(e => e.Entity.GetType().GetProperty("UpdatedAt") != null);

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Modified)
            {
                entry.Property("UpdatedAt").CurrentValue = DateTime.UtcNow;
            }
        }
    }
}
