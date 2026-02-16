using SurveyLite.Domain.Enums;

namespace SurveyLite.Application.DTOs;

public record UserDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    UserRole Role,
    bool IsActive,
    DateTime? LastLoginAt,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record CreateUserDto(
    string Email,
    string Password,
    string FirstName,
    string LastName
);

public record UpdateProfileDto(
    string? FirstName,
    string? LastName,
    string? Email
);

public record ChangePasswordDto(
    string CurrentPassword,
    string NewPassword,
    string ConfirmPassword
);

public record LoginDto(
    string Email,
    string Password
);

public record RegisterDto(
    string Email,
    string Password,
    string ConfirmPassword,
    string FirstName,
    string LastName
);

public record AuthResponseDto(
    Guid UserId,
    string Email,
    string FirstName,
    string LastName,
    UserRole Role,
    string AccessToken,
    string RefreshToken
);
