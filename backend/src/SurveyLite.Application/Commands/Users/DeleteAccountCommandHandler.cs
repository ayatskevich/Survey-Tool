using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Application.Interfaces;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Commands.Users;

public class DeleteAccountCommandHandler : IRequestHandler<DeleteAccountCommand, AccountDeletionResultDto>
{
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IAuthService _authService;

    public DeleteAccountCommandHandler(
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IAuthService authService)
    {
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _authService = authService;
    }

    public async Task<AccountDeletionResultDto> Handle(
        DeleteAccountCommand request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        // Get current user
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        // Verify password before deletion (security measure)
        if (!_authService.VerifyPassword(request.ConfirmPassword, user.PasswordHash))
        {
            throw new InvalidOperationException("Password is incorrect");
        }

        // Soft delete (deactivate account, preserve data)
        user.Deactivate();
        await _userRepository.UpdateAsync(user, cancellationToken);

        return new AccountDeletionResultDto(
            true,
            "Account deleted successfully. Your data will be retained for 30 days before permanent deletion."
        );
    }
}
