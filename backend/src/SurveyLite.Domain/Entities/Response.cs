using SurveyLite.Domain.Common;

namespace SurveyLite.Domain.Entities;

public class Response : BaseEntity
{
    public Guid SurveyId { get; private set; }
    public string? RespondentEmail { get; private set; }
    public string? IpAddress { get; private set; }
    public DateTime SubmittedAt { get; private set; }

    // Navigation properties
    public virtual Survey Survey { get; private set; } = null!;
    public virtual ICollection<Answer> Answers { get; private set; } = new List<Answer>();

    private Response() { } // EF Core constructor

    public Response(Guid surveyId, string? respondentEmail = null, string? ipAddress = null)
    {
        if (surveyId == Guid.Empty)
            throw new ArgumentException("Survey ID cannot be empty", nameof(surveyId));

        SurveyId = surveyId;
        RespondentEmail = respondentEmail;
        IpAddress = ipAddress;
        SubmittedAt = DateTime.UtcNow;
    }

    public void AddAnswer(Answer answer)
    {
        Answers.Add(answer);
    }
}
