using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Application.Interfaces;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Commands.Surveys;

public class CloneSurveyCommandHandler : IRequestHandler<CloneSurveyCommand, CloneSurveyResultDto>
{
    private readonly ISurveyRepository _surveyRepository;
    private readonly IResponseRepository _responseRepository;
    private readonly ICurrentUserService _currentUserService;

    public CloneSurveyCommandHandler(
        ISurveyRepository surveyRepository,
        IResponseRepository responseRepository,
        ICurrentUserService currentUserService)
    {
        _surveyRepository = surveyRepository;
        _responseRepository = responseRepository;
        _currentUserService = currentUserService;
    }

    public async Task<CloneSurveyResultDto> Handle(CloneSurveyCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.SurveyId))
        {
            throw new ArgumentException("Survey ID cannot be empty");
        }

        var originalSurvey = await _surveyRepository.GetByIdWithQuestionsAsync(Guid.Parse(request.SurveyId), cancellationToken);
        if (originalSurvey == null)
        {
            throw new InvalidOperationException($"Survey with ID {request.SurveyId} not found");
        }

        var userId = _currentUserService.UserId;

        // Create new survey with cloned data
        var newSurvey = new Domain.Entities.Survey(
            userId,
            request.NewTitle,
            originalSurvey.Description,
            originalSurvey.Instructions);

        // Cloned surveys start inactive
        newSurvey.Deactivate();

        await _surveyRepository.AddAsync(newSurvey, cancellationToken);

        // Clone all questions
        foreach (var originalQuestion in originalSurvey.Questions)
        {
            var newQuestion = new Domain.Entities.Question(
                newSurvey.Id,
                originalQuestion.Type,
                originalQuestion.Text,
                originalQuestion.Order,
                originalQuestion.IsRequired);

            // Copy options and validation rules if they exist
            if (!string.IsNullOrEmpty(originalQuestion.Options))
            {
                newQuestion.SetOptions(originalQuestion.Options);
            }

            if (!string.IsNullOrEmpty(originalQuestion.ValidationRules))
            {
                newQuestion.SetValidationRules(originalQuestion.ValidationRules);
            }

            newSurvey.AddQuestion(newQuestion);
        }

        await _surveyRepository.UpdateAsync(newSurvey, cancellationToken);

        // Get response count for the cloned survey (should be 0)
        var responses = await _responseRepository.GetAllBySurveyIdWithAnswersAsync(newSurvey.Id, cancellationToken);

        return new CloneSurveyResultDto
        {
            Success = true,
            Message = $"Survey '{originalSurvey.Title}' successfully cloned as '{request.NewTitle}'",
            ClonedSurvey = new SurveyItemDto
            {
                Id = newSurvey.Id.ToString(),
                Title = newSurvey.Title,
                Description = newSurvey.Description,
                IsActive = newSurvey.IsActive,
                IsArchived = newSurvey.IsArchived,
                ResponseCount = responses.Count(),
                CreatedAt = newSurvey.CreatedAt,
                UpdatedAt = newSurvey.UpdatedAt,
                PublishedAt = newSurvey.PublishedAt
            }
        };
    }
}
