using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Commands.Surveys;

public record UpdateSurveyCommand(
    Guid Id,
    string Title,
    string? Description,
    bool IsActive
) : IRequest<SurveyResponseDto>;
