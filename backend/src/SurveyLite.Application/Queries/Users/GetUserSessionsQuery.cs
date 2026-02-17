using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Queries.Users;

public record GetUserSessionsQuery : IRequest<List<UserSessionDto>>;
