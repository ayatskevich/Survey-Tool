using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SurveyLite.Domain.Entities;

namespace SurveyLite.Infrastructure.Persistence.EntityConfigurations;

public class AnswerEntityTypeConfiguration : IEntityTypeConfiguration<Answer>
{
    public void Configure(EntityTypeBuilder<Answer> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.ResponseId)
            .IsRequired();

        builder.Property(x => x.QuestionId)
            .IsRequired();

        builder.Property(x => x.AnswerText)
            .IsRequired(false);

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.UpdatedAt)
            .IsRequired(false);

        builder.HasIndex(x => x.ResponseId);
        builder.HasIndex(x => x.QuestionId);

        builder.HasOne(x => x.Response)
            .WithMany(x => x.Answers)
            .HasForeignKey(x => x.ResponseId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Question)
            .WithMany(x => x.Answers)
            .HasForeignKey(x => x.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
