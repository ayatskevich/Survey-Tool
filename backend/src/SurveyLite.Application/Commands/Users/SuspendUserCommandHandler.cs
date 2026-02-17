using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Commands.Users;

public class SuspendUserCommandHandler : IRequestHandler<SuspendUserCommand, SuspensionResultDto>
{
    private readonly IUserRepository _userRepository;

    public SuspendUserCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<SuspensionResultDto> Handle(SuspendUserCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.UserId))
        {
            throw new ArgumentException("User ID cannot be empty");
        }

        var user = await _userRepository.GetByIdAsync(Guid.Parse(request.UserId), cancellationToken);
        if (user == null)
        {
            throw new InvalidOperationException($"User with ID {request.UserId} not found");
        }

        if (request.Suspend)
        {
            if (!user.IsActive)
            {
                throw new InvalidOperationException("User is already suspended");
            }

            user.Deactivate();
        }
        else
        {
            if (user.IsActive)
            {
                throw new InvalidOperationException("User is not suspended");
            }

            user.Activate();
        }

        await _userRepository.UpdateAsync(user, cancellationToken);

        return new SuspensionResultDto
        {
            Success = true,
            Message = request.Suspend
                ? $"User {user.Email} has been suspended"
                : $"User {user.Email} has been unsuspended"
        };
    }
}
