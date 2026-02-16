using SurveyLite.Domain.Common;
using SurveyLite.Domain.Enums;

namespace SurveyLite.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public UserRole Role { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime? LastLoginAt { get; private set; }

    // Navigation properties
    public virtual ICollection<Survey> Surveys { get; private set; } = new List<Survey>();

    private User() { } // EF Core constructor

    public User(string email, string passwordHash, string firstName, string lastName, UserRole role = UserRole.User)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email cannot be empty", nameof(email));
        
        if (string.IsNullOrWhiteSpace(passwordHash))
            throw new ArgumentException("Password hash cannot be empty", nameof(passwordHash));

        Email = email.ToLowerInvariant();
        PasswordHash = passwordHash;
        FirstName = firstName;
        LastName = lastName;
        Role = role;
        IsActive = true;
    }

    public void UpdateProfile(string firstName, string lastName, string email)
    {
        if (!string.IsNullOrWhiteSpace(firstName))
            FirstName = firstName;
        
        if (!string.IsNullOrWhiteSpace(lastName))
            LastName = lastName;
        
        if (!string.IsNullOrWhiteSpace(email))
            Email = email.ToLowerInvariant();

        UpdatedAt = DateTime.UtcNow;
    }

    public void ChangePassword(string newPasswordHash)
    {
        if (string.IsNullOrWhiteSpace(newPasswordHash))
            throw new ArgumentException("Password hash cannot be empty", nameof(newPasswordHash));

        PasswordHash = newPasswordHash;
        UpdatedAt = DateTime.UtcNow;
    }

    public void RecordLogin()
    {
        LastLoginAt = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Activate()
    {
        IsActive = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ChangeRole(UserRole newRole)
    {
        Role = newRole;
        UpdatedAt = DateTime.UtcNow;
    }
}
