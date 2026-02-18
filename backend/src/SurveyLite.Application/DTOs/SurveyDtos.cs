using SurveyLite.Domain.Enums;

namespace SurveyLite.Application.DTOs;

public record SurveyResponseDto(
    Guid Id,
    string Title,
    string? Description,
    bool IsActive,
    int QuestionCount,
    int ResponseCount,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    IEnumerable<QuestionDto>? Questions = null
)
{
    public SurveyResponseDto() : this(Guid.Empty, "", null, false, 0, 0, DateTime.MinValue, null, null) { }
}

public record SurveyListDto(
    Guid Id,
    string Title,
    string? Description,
    bool IsActive,
    int QuestionCount,
    int ResponseCount,
    DateTime CreatedAt,
    DateTime? UpdatedAt
)
{
    public SurveyListDto() : this(Guid.Empty, "", null, false, 0, 0, DateTime.MinValue, null) { }
}

public record CreateSurveyDto(
    string Title,
    string? Description,
    bool IsActive
);

public record UpdateSurveyDto(
    string Title,
    string? Description,
    bool IsActive
);

public record QuestionDto(
    Guid Id,
    QuestionType Type,
    string Text,
    int Order,
    bool IsRequired,
    string? Options,
    string? ValidationRules
);

public record CreateQuestionDto(
    QuestionType Type,
    string Text,
    int Order,
    bool IsRequired,
    string? Options,
    string? ValidationRules
);

public record UpdateQuestionDto(
    string Text,
    bool IsRequired,
    string? Options,
    string? ValidationRules
);
