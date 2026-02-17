namespace SurveyLite.Application.DTOs;

/// <summary>
/// DTO for survey filters
/// </summary>
public record SurveyFiltersDto
{
    public string? SearchTerm { get; init; }
    public bool? IsActive { get; init; }
    public bool? IsArchived { get; init; }
    public DateTime? CreatedFromDate { get; init; }
    public DateTime? CreatedToDate { get; init; }
    public string? SortBy { get; init; } = "CreatedAt";
    public bool SortDescending { get; init; } = true;
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}

/// <summary>
/// DTO for survey list item
/// </summary>
public record SurveyItemDto
{
    public string Id { get; init; }
    public string Title { get; init; }
    public string Description { get; init; }
    public bool IsActive { get; init; }
    public bool IsArchived { get; init; }
    public int ResponseCount { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
    public DateTime? PublishedAt { get; init; }
}

/// <summary>
/// Paginated list of surveys
/// </summary>
public record SurveyPageDto
{
    public List<SurveyItemDto> Items { get; init; }
    public int TotalCount { get; init; }
    public int Page { get; init; }
    public int PageSize { get; init; }
}

/// <summary>
/// DTO for cloning a survey
/// </summary>
public record CloneSurveyDto
{
    public string SurveyId { get; init; }
    public string NewTitle { get; init; }
}

/// <summary>
/// DTO for clone result
/// </summary>
public record CloneSurveyResultDto
{
    public bool Success { get; init; }
    public string Message { get; init; }
    public SurveyItemDto ClonedSurvey { get; init; }
}

/// <summary>
/// DTO for bulk archive operation
/// </summary>
public record BulkArchiveSurveysDto
{
    public List<string> SurveyIds { get; init; }
    public bool Archive { get; init; } = true;
}

/// <summary>
/// DTO for bulk archive result
/// </summary>
public record BulkArchiveResultDto
{
    public bool Success { get; init; }
    public string Message { get; init; }
    public int Count { get; init; }
}
