using SurveyLite.Domain.Enums;

namespace SurveyLite.Application.DTOs;

/// <summary>
/// DTO for user list view (admin)
/// </summary>
public record AdminUserDto
{
    public string Id { get; init; }
    public string Email { get; init; }
    public string FirstName { get; init; }
    public string LastName { get; init; }
    public string Role { get; init; }
    public bool IsActive { get; init; }
    public int SurveyCount { get; init; }
    public int ResponseCount { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? LastLoginAt { get; init; }
}

/// <summary>
/// DTO for user filters
/// </summary>
public record UserFiltersDto
{
    public string? SearchTerm { get; init; }
    public string? Role { get; init; }
    public bool? IsActive { get; init; }
    public DateTime? CreatedFromDate { get; init; }
    public DateTime? CreatedToDate { get; init; }
    public string? SortBy { get; init; } = "CreatedAt";
    public bool SortDescending { get; init; } = true;
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}

/// <summary>
/// DTO for user detail view with all information
/// </summary>
public record UserDetailDto
{
    public string Id { get; init; }
    public string Email { get; init; }
    public string FirstName { get; init; }
    public string LastName { get; init; }
    public string Role { get; init; }
    public bool IsActive { get; init; }
    public int SurveyCount { get; init; }
    public int ResponseCount { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? LastLoginAt { get; init; }
}

/// <summary>
/// DTO for updating user role
/// </summary>
public record UpdateUserRoleDto
{
    public string UserId { get; init; }
    public string Role { get; init; }
}

/// <summary>
/// DTO for role update result
/// </summary>
public record RoleUpdateResultDto
{
    public bool Success { get; init; }
    public string Message { get; init; }
    public AdminUserDto User { get; init; }
}

/// <summary>
/// DTO for user suspension
/// </summary>
public record SuspendUserDto
{
    public string UserId { get; init; }
    public bool Suspend { get; init; }
    public string Reason { get; init; }
}

/// <summary>
/// DTO for suspension result
/// </summary>
public record SuspensionResultDto
{
    public bool Success { get; init; }
    public string Message { get; init; }
}

/// <summary>
/// Paginated list of users
/// </summary>
public record UserPageDto
{
    public List<AdminUserDto> Items { get; init; }
    public int TotalCount { get; init; }
    public int Page { get; init; }
    public int PageSize { get; init; }
}
