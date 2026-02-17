using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Queries.Users;

public record GetUserProfileQuery : IRequest<UserProfileDto>;
