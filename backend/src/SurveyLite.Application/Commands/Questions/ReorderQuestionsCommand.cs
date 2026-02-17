using MediatR;

namespace SurveyLite.Application.Commands.Questions;

public record ReorderQuestionsCommand(
    Guid SurveyId,
    IEnumerable<QuestionOrderDto> Questions
) : IRequest<bool>;

public record QuestionOrderDto(Guid Id, int Order);
