using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Queries.Analytics;

public record ExportAnalyticsQuery(
    string SurveyId,
    string Format,
    DateTime? FromDate,
    DateTime? ToDate,
    bool IncludeAnswers) : IRequest<ExportResultDto>;
