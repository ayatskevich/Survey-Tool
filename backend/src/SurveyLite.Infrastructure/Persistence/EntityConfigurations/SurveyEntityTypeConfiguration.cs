using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SurveyLite.Domain.Entities;

namespace SurveyLite.Infrastructure.Persistence.EntityConfigurations;

public class SurveyEntityTypeConfiguration : IEntityTypeConfiguration<Survey>
{
    public void Configure(EntityTypeBuilder<Survey> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.UserId)
            .IsRequired();

        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Description)
            .IsRequired(false)
            .HasMaxLength(1000);

        builder.Property(x => x.IsActive)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.UpdatedAt)
            .IsRequired(false);

        builder.HasIndex(x => new { x.UserId, x.IsActive })
            .HasDatabaseName("IX_Surveys_UserId_IsActive");

        builder.HasOne(x => x.User)
            .WithMany(x => x.Surveys)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Questions)
            .WithOne(x => x.Survey)
            .HasForeignKey(x => x.SurveyId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Responses)
            .WithOne(x => x.Survey)
            .HasForeignKey(x => x.SurveyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
