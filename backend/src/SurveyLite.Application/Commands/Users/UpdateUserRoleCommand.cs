using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Commands.Users;

public record UpdateUserRoleCommand(string UserId, string Role) : IRequest<RoleUpdateResultDto>;
