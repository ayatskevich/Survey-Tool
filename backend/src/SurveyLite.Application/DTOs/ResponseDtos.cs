namespace SurveyLite.Application.DTOs;

public record ResponseSummaryDto(
    Guid Id,
    string? RespondentEmail,
    DateTime SubmittedAt,
    int AnswerCount
);

public record ResponseDetailDto(
    Guid Id,
    Guid SurveyId,
    string? RespondentEmail,
    string? IpAddress,
    DateTime SubmittedAt,
    List<ResponseAnswerDto> Answers
);

public record ResponseAnswerDto(
    Guid QuestionId,
    string QuestionText,
    string QuestionType,
    string AnswerText
);

public record SurveyAnalyticsDto(
    Guid SurveyId,
    string SurveyTitle,
    int TotalResponses,
    DateTime? FirstResponseAt,
    DateTime? LastResponseAt,
    List<ResponseTimelineDto> ResponseTimeline,
    List<QuestionStatisticsDto> QuestionStatistics
);

public record ResponseTimelineDto(
    DateTime Date,
    int Count
);

public record QuestionStatisticsDto(
    Guid QuestionId,
    string QuestionText,
    string QuestionType,
    int TotalAnswers,
    Dictionary<string, int>? OptionBreakdown, // For multiple choice/checkboxes
    double? AverageRating, // For rating questions
    List<string>? TopAnswers // For text questions
);

public record ExportResponseDto(
    Guid ResponseId,
    string? RespondentEmail,
    DateTime SubmittedAt,
    Dictionary<string, string> Answers // QuestionText -> AnswerText
);
