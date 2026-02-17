using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Commands.Users;

/// <summary>
/// Delete user account (with confirmation password)
/// </summary>
public record DeleteAccountCommand(
    string ConfirmPassword
) : IRequest<AccountDeletionResultDto>;
