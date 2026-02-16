using SurveyLite.Domain.Common;
using SurveyLite.Domain.Enums;

namespace SurveyLite.Domain.Entities;

public class Question : BaseEntity
{
    public Guid SurveyId { get; private set; }
    public QuestionType Type { get; private set; }
    public string Text { get; private set; }= string.Empty;
    public int Order { get; private set; }
    public bool IsRequired { get; private set; }
    public string? Options { get; private set; } // JSON for multiple choice/checkboxes
    public string? ValidationRules { get; private set; } // JSON for validation

    // Navigation properties
    public virtual Survey Survey { get; private set; } = null!;
    public virtual ICollection<Answer> Answers { get; private set; } = new List<Answer>();

    private Question() { } // EF Core constructor

    public Question(Guid surveyId, QuestionType type, string text, int order, bool isRequired = false)
    {
        if (surveyId == Guid.Empty)
            throw new ArgumentException("Survey ID cannot be empty", nameof(surveyId));
        
        if (string.IsNullOrWhiteSpace(text))
            throw new ArgumentException("Question text cannot be empty", nameof(text));

        SurveyId = surveyId;
        Type = type;
        Text = text;
        Order = order;
        IsRequired = isRequired;
    }

    public void Update(string text, bool isRequired, string? options = null, string? validationRules = null)
    {
        if (!string.IsNullOrWhiteSpace(text))
            Text = text;
        
        IsRequired = isRequired;
        Options = options;
        ValidationRules = validationRules;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateOrder(int newOrder)
    {
        Order = newOrder;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetOptions(string options)
    {
        Options = options;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetValidationRules(string rules)
    {
        ValidationRules = rules;
        UpdatedAt = DateTime.UtcNow;
    }
}
