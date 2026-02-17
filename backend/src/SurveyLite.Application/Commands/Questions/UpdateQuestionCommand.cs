using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Commands.Questions;

public record UpdateQuestionCommand(
    Guid SurveyId,
    Guid QuestionId,
    string Text,
    bool IsRequired,
    string? Options = null,
    string? ValidationRules = null
) : IRequest<QuestionDto>;
