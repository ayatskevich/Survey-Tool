using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Queries.Responses;

public record GetResponseByIdQuery(
    Guid SurveyId,
    Guid ResponseId
) : IRequest<ResponseDetailDto?>;
