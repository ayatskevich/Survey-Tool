using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Queries.Surveys;

public record GetSurveysWithFiltersQuery(SurveyFiltersDto Filters) : IRequest<SurveyPageDto>;
