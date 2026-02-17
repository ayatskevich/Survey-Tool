using MediatR;

namespace SurveyLite.Application.Commands.Surveys;

public record DeleteSurveyCommand(Guid Id) : IRequest<bool>;
