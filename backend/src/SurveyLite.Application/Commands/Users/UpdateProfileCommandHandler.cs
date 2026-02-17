using MediatR;
using AutoMapper;
using SurveyLite.Application.DTOs;
using SurveyLite.Application.Interfaces;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Commands.Users;

public class UpdateProfileCommandHandler : IRequestHandler<UpdateProfileCommand, ProfileUpdateResultDto>
{
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;

    public UpdateProfileCommandHandler(
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _mapper = mapper;
    }

    public async Task<ProfileUpdateResultDto> Handle(
        UpdateProfileCommand request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        // Get current user
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        // Update user with provided fields
        user.UpdateProfile(
            request.FirstName ?? user.FirstName,
            request.LastName ?? user.LastName,
            request.Email ?? user.Email
        );
        
        await _userRepository.UpdateAsync(user, cancellationToken);

        var userProfileDto = new UserProfileDto(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName,
            user.CreatedAt
        );

        return new ProfileUpdateResultDto(
            true,
            "Profile updated successfully",
            userProfileDto
        );
    }
}
