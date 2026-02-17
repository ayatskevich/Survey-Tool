using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Commands.Users;

/// <summary>
/// Change user password
/// </summary>
public record ChangePasswordCommand(
    string CurrentPassword,
    string NewPassword,
    string ConfirmPassword
) : IRequest<PasswordChangeResultDto>;
