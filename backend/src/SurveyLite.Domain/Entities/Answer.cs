using SurveyLite.Domain.Common;

namespace SurveyLite.Domain.Entities;

public class Answer : BaseEntity
{
    public Guid ResponseId { get; private set; }
    public Guid QuestionId { get; private set; }
    public string AnswerText { get; private set; } = string.Empty;

    // Navigation properties
    public virtual Response Response { get; private set; } = null!;
    public virtual Question Question { get; private set; } = null!;

    private Answer() { } // EF Core constructor

    public Answer(Guid responseId, Guid questionId, string answerText)
    {
        if (responseId == Guid.Empty)
            throw new ArgumentException("Response ID cannot be empty", nameof(responseId));
        
        if (questionId == Guid.Empty)
            throw new ArgumentException("Question ID cannot be empty", nameof(questionId));

        ResponseId = responseId;
        QuestionId = questionId;
        AnswerText = answerText ?? string.Empty;
    }

    public void UpdateAnswer(string newAnswerText)
    {
        AnswerText = newAnswerText ?? string.Empty;
        UpdatedAt = DateTime.UtcNow;
    }
}
