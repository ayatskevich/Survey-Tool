using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Queries.Surveys;

public record GetSurveyByIdQuery(Guid Id) : IRequest<SurveyResponseDto>;
