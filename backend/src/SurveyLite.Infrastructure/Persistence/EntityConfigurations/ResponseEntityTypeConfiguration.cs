using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SurveyLite.Domain.Entities;

namespace SurveyLite.Infrastructure.Persistence.EntityConfigurations;

public class ResponseEntityTypeConfiguration : IEntityTypeConfiguration<Response>
{
    public void Configure(EntityTypeBuilder<Response> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.SurveyId)
            .IsRequired();

        builder.Property(x => x.RespondentEmail)
            .IsRequired(false)
            .HasMaxLength(256);

        builder.Property(x => x.IpAddress)
            .IsRequired(false)
            .HasMaxLength(45);

        builder.Property(x => x.SubmittedAt)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.UpdatedAt)
            .IsRequired(false);

        builder.HasIndex(x => new { x.SurveyId, x.SubmittedAt })
            .HasDatabaseName("IX_Responses_SurveyId_SubmittedAt");

        builder.HasOne(x => x.Survey)
            .WithMany(x => x.Responses)
            .HasForeignKey(x => x.SurveyId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Answers)
            .WithOne(x => x.Response)
            .HasForeignKey(x => x.ResponseId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
