namespace SurveyLite.Application.DTOs;

// User profile information
public record UserProfileDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    DateTime CreatedAt
);

// User session information
public record UserSessionDto(
    string SessionId,
    string? DeviceInfo,
    DateTime LastActive,
    bool IsCurrentSession
);

// Response for successful profile update
public record ProfileUpdateResultDto(
    bool Success,
    string Message,
    UserProfileDto UpdatedProfile
);

// Response for password change
public record PasswordChangeResultDto(
    bool Success,
    string Message
);

// Response for account deletion
public record AccountDeletionResultDto(
    bool Success,
    string Message
);
