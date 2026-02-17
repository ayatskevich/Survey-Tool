using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Queries.PublicSurveys;

public class GetPublicSurveyQueryHandler : IRequestHandler<GetPublicSurveyQuery, PublicSurveyDto>
{
    private readonly ISurveyRepository _surveyRepository;

    public GetPublicSurveyQueryHandler(ISurveyRepository surveyRepository)
    {
        _surveyRepository = surveyRepository;
    }

    public async Task<PublicSurveyDto> Handle(GetPublicSurveyQuery request, CancellationToken cancellationToken)
    {
        var survey = await _surveyRepository.GetByIdWithQuestionsAsync(request.SurveyId, cancellationToken);

        if (survey == null || !survey.IsActive)
            throw new InvalidOperationException("Survey not found or not active");

        var questions = survey.Questions
            .OrderBy(q => q.Order)
            .Select(q => new PublicQuestionDto(
                q.Id,
                q.Type,
                q.Text,
                q.Order,
                q.IsRequired,
                q.Options
            ))
            .ToList();

        return new PublicSurveyDto(
            survey.Id,
            survey.Title,
            survey.Description,
            questions
        );
    }
}
