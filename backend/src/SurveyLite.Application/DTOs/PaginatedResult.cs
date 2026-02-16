namespace SurveyLite.Application.DTOs;

public record PaginatedResult<T>(
    IEnumerable<T> Items,
    int Page,
    int PageSize,
    int TotalCount,
    int TotalPages
);
