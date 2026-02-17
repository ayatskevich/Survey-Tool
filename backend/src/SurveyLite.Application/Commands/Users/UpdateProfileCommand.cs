using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Commands.Users;

/// <summary>
/// Update user profile (first name, last name, email)
/// </summary>
public record UpdateProfileCommand(
    string? FirstName,
    string? LastName,
    string? Email
) : IRequest<ProfileUpdateResultDto>;
