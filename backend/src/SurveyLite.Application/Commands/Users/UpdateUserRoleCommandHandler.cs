using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Domain.Enums;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Commands.Users;

public class UpdateUserRoleCommandHandler : IRequestHandler<UpdateUserRoleCommand, RoleUpdateResultDto>
{
    private readonly IUserRepository _userRepository;
    private readonly ISurveyRepository _surveyRepository;
    private readonly IResponseRepository _responseRepository;

    public UpdateUserRoleCommandHandler(
        IUserRepository userRepository,
        ISurveyRepository surveyRepository,
        IResponseRepository responseRepository)
    {
        _userRepository = userRepository;
        _surveyRepository = surveyRepository;
        _responseRepository = responseRepository;
    }

    public async Task<RoleUpdateResultDto> Handle(UpdateUserRoleCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.UserId))
        {
            throw new ArgumentException("User ID cannot be empty");
        }

        if (string.IsNullOrWhiteSpace(request.Role))
        {
            throw new ArgumentException("Role cannot be empty");
        }

        // Parse role string to enum
        if (!Enum.TryParse<UserRole>(request.Role, ignoreCase: true, out var roleEnum))
        {
            throw new ArgumentException($"Invalid role. Valid roles are: User, Admin");
        }

        var user = await _userRepository.GetByIdAsync(Guid.Parse(request.UserId), cancellationToken);
        if (user == null)
        {
            throw new InvalidOperationException($"User with ID {request.UserId} not found");
        }

        var oldRole = user.Role;
        user.ChangeRole(roleEnum);

        await _userRepository.UpdateAsync(user, cancellationToken);

        // Get user counts for response DTO
        var surveys = await _surveyRepository.GetUserSurveysAsync(user.Id, 1, int.MaxValue, null, cancellationToken);
        var surveyCount = surveys.Count();

        var responses = new List<Domain.Entities.Response>();
        foreach (var survey in surveys)
        {
            var surveyResponses = await _responseRepository.GetAllBySurveyIdWithAnswersAsync(survey.Id, cancellationToken);
            responses.AddRange(surveyResponses);
        }

        return new RoleUpdateResultDto
        {
            Success = true,
            Message = $"User role successfully updated from {oldRole} to {roleEnum}",
            User = new AdminUserDto
            {
                Id = user.Id.ToString(),
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role.ToString(),
                IsActive = user.IsActive,
                SurveyCount = surveyCount,
                ResponseCount = responses.Count(),
                CreatedAt = user.CreatedAt,
                LastLoginAt = user.LastLoginAt
            }
        };
    }
}
