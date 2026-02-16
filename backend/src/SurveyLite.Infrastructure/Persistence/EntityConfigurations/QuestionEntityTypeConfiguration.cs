using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SurveyLite.Domain.Entities;
using SurveyLite.Domain.Enums;

namespace SurveyLite.Infrastructure.Persistence.EntityConfigurations;

public class QuestionEntityTypeConfiguration : IEntityTypeConfiguration<Question>
{
    public void Configure(EntityTypeBuilder<Question> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.SurveyId)
            .IsRequired();

        builder.Property(x => x.Type)
            .HasConversion(
                v => v.ToString(),
                v => (QuestionType)Enum.Parse(typeof(QuestionType), v))
            .IsRequired();

        builder.Property(x => x.Text)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(x => x.Order)
            .IsRequired();

        builder.Property(x => x.IsRequired)
            .IsRequired();

        builder.Property(x => x.Options)
            .IsRequired(false)
            .HasColumnType("jsonb");

        builder.Property(x => x.ValidationRules)
            .IsRequired(false)
            .HasColumnType("jsonb");

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.UpdatedAt)
            .IsRequired(false);

        builder.HasIndex(x => x.SurveyId);

        builder.HasOne(x => x.Survey)
            .WithMany(x => x.Questions)
            .HasForeignKey(x => x.SurveyId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Answers)
            .WithOne(x => x.Question)
            .HasForeignKey(x => x.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
