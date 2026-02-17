using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Queries.Surveys;

public record GetSurveysQuery(
    int Page = 1,
    int PageSize = 10,
    string? SearchTerm = null
) : IRequest<PaginatedResult<SurveyListDto>>;
