using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Queries.Questions;

public record GetQuestionsQuery(Guid SurveyId) : IRequest<IEnumerable<QuestionDto>>;
