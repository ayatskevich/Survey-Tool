namespace SurveyLite.Application.DTOs;

/// <summary>
/// DTO for export request
/// </summary>
public record ExportAnalyticsDto
{
    public string SurveyId { get; init; }
    public string Format { get; init; } = "csv"; // csv or json
    public DateTime? FromDate { get; init; }
    public DateTime? ToDate { get; init; }
    public bool IncludeAnswers { get; init; } = true;
}

/// <summary>
/// DTO for export result
/// </summary>
public record ExportResultDto
{
    public bool Success { get; init; }
    public string Message { get; init; }
    public string FileContent { get; init; }
    public string FileName { get; init; }
    public string ContentType { get; init; }
}
