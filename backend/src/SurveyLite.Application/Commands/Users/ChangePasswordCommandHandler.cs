using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Application.Interfaces;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Commands.Users;

public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, PasswordChangeResultDto>
{
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IAuthService _authService;

    public ChangePasswordCommandHandler(
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IAuthService authService)
    {
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _authService = authService;
    }

    public async Task<PasswordChangeResultDto> Handle(
        ChangePasswordCommand request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        // Get current user
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        // Validate input
        if (string.IsNullOrWhiteSpace(request.CurrentPassword))
        {
            throw new ArgumentException("Current password is required");
        }

        if (string.IsNullOrWhiteSpace(request.NewPassword))
        {
            throw new ArgumentException("New password is required");
        }

        if (request.NewPassword != request.ConfirmPassword)
        {
            throw new ArgumentException("New password and confirmation do not match");
        }

        if (request.NewPassword.Length < 8)
        {
            throw new ArgumentException("New password must be at least 8 characters");
        }

        // Verify current password
        if (!_authService.VerifyPassword(request.CurrentPassword, user.PasswordHash))
        {
            throw new InvalidOperationException("Current password is incorrect");
        }

        // Prevent using the same password
        if (_authService.VerifyPassword(request.NewPassword, user.PasswordHash))
        {
            throw new ArgumentException("New password must be different from current password");
        }

        // Update password
        user.ChangePassword(_authService.HashPassword(request.NewPassword));
        await _userRepository.UpdateAsync(user, cancellationToken);

        return new PasswordChangeResultDto(
            true,
            "Password changed successfully"
        );
    }
}
