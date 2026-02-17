using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Commands.Surveys;

public record CreateSurveyCommand(
    string Title,
    string? Description,
    bool IsActive = false
) : IRequest<SurveyResponseDto>;
