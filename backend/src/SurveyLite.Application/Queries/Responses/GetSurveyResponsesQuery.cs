using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Queries.Responses;

public record GetSurveyResponsesQuery(
    Guid SurveyId,
    int Page = 1,
    int PageSize = 10
) : IRequest<PaginatedResult<ResponseSummaryDto>>;
