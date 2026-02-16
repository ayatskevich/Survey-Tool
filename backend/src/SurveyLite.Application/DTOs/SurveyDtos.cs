using SurveyLite.Domain.Enums;

namespace SurveyLite.Application.DTOs;

public record SurveyDto(
    Guid Id,
    string Title,
    string Description,
    bool IsActive,
    int QuestionCount,
    int ResponseCount,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record CreateSurveyDto(
    string Title,
    string Description
);

public record UpdateSurveyDto(
    string Title,
    string Description
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
