using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Queries.Responses;

public record GetSurveyAnalyticsQuery(
    Guid SurveyId
) : IRequest<SurveyAnalyticsDto>;
