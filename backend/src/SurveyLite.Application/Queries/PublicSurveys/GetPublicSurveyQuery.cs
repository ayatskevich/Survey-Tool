using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Queries.PublicSurveys;

public record GetPublicSurveyQuery(Guid SurveyId) : IRequest<PublicSurveyDto>;
