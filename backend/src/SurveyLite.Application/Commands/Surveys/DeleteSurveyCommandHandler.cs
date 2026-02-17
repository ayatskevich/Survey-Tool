using MediatR;
using SurveyLite.Application.Interfaces;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Commands.Surveys;

public class DeleteSurveyCommandHandler : IRequestHandler<DeleteSurveyCommand, bool>
{
    private readonly ISurveyRepository _surveyRepository;
    private readonly ICurrentUserService _currentUserService;

    public DeleteSurveyCommandHandler(
        ISurveyRepository surveyRepository,
        ICurrentUserService currentUserService)
    {
        _surveyRepository = surveyRepository;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(DeleteSurveyCommand request, CancellationToken cancellationToken)
    {
        var survey = await _surveyRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (survey == null)
        {
            throw new KeyNotFoundException($"Survey with ID {request.Id} not found.");
        }

        if (survey.UserId != _currentUserService.UserId)
        {
            throw new UnauthorizedAccessException("You are not authorized to delete this survey.");
        }

        await _surveyRepository.DeleteAsync(survey, cancellationToken);

        return true;
    }
}
