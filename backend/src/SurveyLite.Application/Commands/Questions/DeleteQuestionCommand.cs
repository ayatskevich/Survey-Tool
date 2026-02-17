using MediatR;

namespace SurveyLite.Application.Commands.Questions;

public record DeleteQuestionCommand(
    Guid SurveyId,
    Guid QuestionId
) : IRequest<bool>;
