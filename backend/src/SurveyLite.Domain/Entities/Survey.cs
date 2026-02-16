using SurveyLite.Domain.Common;

namespace SurveyLite.Domain.Entities;

public class Survey : BaseEntity
{
    public Guid UserId { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public bool IsActive { get; private set; }

    // Navigation properties
    public virtual User User { get; private set; } = null!;
    public virtual ICollection<Question> Questions { get; private set; } = new List<Question>();
    public virtual ICollection<Response> Responses { get; private set; } = new List<Response>();

    private Survey() { } // EF Core constructor

    public Survey(Guid userId, string title, string description)
    {
        if (userId == Guid.Empty)
            throw new ArgumentException("User ID cannot be empty", nameof(userId));
        
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Title cannot be empty", nameof(title));

        UserId = userId;
        Title = title;
        Description = description ?? string.Empty;
        IsActive = false;
    }

    public void Update(string title, string description)
    {
        if (!string.IsNullOrWhiteSpace(title))
            Title = title;
        
        Description = description ?? string.Empty;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Activate()
    {
        IsActive = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddQuestion(Question question)
    {
        Questions.Add(question);
        UpdatedAt = DateTime.UtcNow;
    }

    public void RemoveQuestion(Question question)
    {
        Questions.Remove(question);
        UpdatedAt = DateTime.UtcNow;
    }
}
