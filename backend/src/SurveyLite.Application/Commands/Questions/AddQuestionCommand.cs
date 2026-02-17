using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Domain.Enums;

namespace SurveyLite.Application.Commands.Questions;

public record AddQuestionCommand(
    Guid SurveyId,
    QuestionType Type,
    string Text,
    int Order,
    bool IsRequired,
    string? Options = null,
    string? ValidationRules = null
) : IRequest<QuestionDto>;
