using SurveyLite.Domain.Enums;

namespace SurveyLite.Application.DTOs;

public record PublicSurveyDto(
    Guid Id,
    string Title,
    string Description,
    IEnumerable<PublicQuestionDto> Questions
);

public record PublicQuestionDto(
    Guid Id,
    QuestionType Type,
    string Text,
    int Order,
    bool IsRequired,
    string? Options
);

public record SubmitResponseDto(
    string? RespondentEmail,
    IEnumerable<AnswerSubmissionDto> Answers
);

public record AnswerSubmissionDto(
    Guid QuestionId,
    string AnswerText
);

public record ResponseSubmissionResult(
    Guid ResponseId,
    DateTime SubmittedAt
);
