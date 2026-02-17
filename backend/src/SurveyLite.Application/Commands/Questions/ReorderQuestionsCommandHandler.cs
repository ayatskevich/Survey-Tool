using MediatR;
using SurveyLite.Application.Interfaces;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Commands.Questions;

public class ReorderQuestionsCommandHandler : IRequestHandler<ReorderQuestionsCommand, bool>
{
    private readonly ISurveyRepository _surveyRepository;
    private readonly ICurrentUserService _currentUserService;

    public ReorderQuestionsCommandHandler(
        ISurveyRepository surveyRepository,
        ICurrentUserService currentUserService)
    {
        _surveyRepository = surveyRepository;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(ReorderQuestionsCommand request, CancellationToken cancellationToken)
    {
        var survey = await _surveyRepository.GetByIdWithQuestionsAsync(request.SurveyId, cancellationToken);
        
        if (survey == null)
        {
            throw new KeyNotFoundException($"Survey with ID {request.SurveyId} not found.");
        }

        if (survey.UserId != _currentUserService.UserId)
        {
            throw new UnauthorizedAccessException("You are not authorized to reorder questions in this survey.");
        }

        foreach (var questionOrder in request.Questions)
        {
            var question = survey.Questions.FirstOrDefault(q => q.Id == questionOrder.Id);
            
            if (question != null)
            {
                question.UpdateOrder(questionOrder.Order);
            }
        }

        await _surveyRepository.UpdateAsync(survey, cancellationToken);

        return true;
    }
}
