using MediatR;
using SurveyLite.Application.Interfaces;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Commands.Questions;

public class DeleteQuestionCommandHandler : IRequestHandler<DeleteQuestionCommand, bool>
{
    private readonly ISurveyRepository _surveyRepository;
    private readonly ICurrentUserService _currentUserService;

    public DeleteQuestionCommandHandler(
        ISurveyRepository surveyRepository,
        ICurrentUserService currentUserService)
    {
        _surveyRepository = surveyRepository;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(DeleteQuestionCommand request, CancellationToken cancellationToken)
    {
        var survey = await _surveyRepository.GetByIdWithQuestionsAsync(request.SurveyId, cancellationToken);
        
        if (survey == null)
        {
            throw new KeyNotFoundException($"Survey with ID {request.SurveyId} not found.");
        }

        if (survey.UserId != _currentUserService.UserId)
        {
            throw new UnauthorizedAccessException("You are not authorized to delete questions from this survey.");
        }

        var question = survey.Questions.FirstOrDefault(q => q.Id == request.QuestionId);
        
        if (question == null)
        {
            throw new KeyNotFoundException($"Question with ID {request.QuestionId} not found in this survey.");
        }

        survey.RemoveQuestion(question);
        await _surveyRepository.UpdateAsync(survey, cancellationToken);

        return true;
    }
}
