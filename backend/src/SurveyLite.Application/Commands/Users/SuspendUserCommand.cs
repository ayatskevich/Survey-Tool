using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Commands.Users;

public record SuspendUserCommand(string UserId, bool Suspend, string Reason) : IRequest<SuspensionResultDto>;
