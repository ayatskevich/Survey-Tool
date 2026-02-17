using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Domain.Enums;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Queries.Responses;

public class GetSurveyAnalyticsQueryHandler : IRequestHandler<GetSurveyAnalyticsQuery, SurveyAnalyticsDto>
{
    private readonly IResponseRepository _responseRepository;
    private readonly ISurveyRepository _surveyRepository;

    public GetSurveyAnalyticsQueryHandler(
        IResponseRepository responseRepository,
        ISurveyRepository surveyRepository)
    {
        _responseRepository = responseRepository;
        _surveyRepository = surveyRepository;
    }

    public async Task<SurveyAnalyticsDto> Handle(
        GetSurveyAnalyticsQuery request,
        CancellationToken cancellationToken)
    {
        var survey = await _surveyRepository.GetByIdWithQuestionsAsync(request.SurveyId, cancellationToken);
        if (survey == null)
        {
            throw new InvalidOperationException("Survey not found");
        }

        var responses = (await _responseRepository.GetAllBySurveyIdWithAnswersAsync(request.SurveyId, cancellationToken)).ToList();

        var totalResponses = responses.Count;
        var firstResponseAt = responses.FirstOrDefault()?.SubmittedAt;
        var lastResponseAt = responses.LastOrDefault()?.SubmittedAt;

        // Group responses by date for timeline
        var responseTimeline = responses
            .GroupBy(r => r.SubmittedAt.Date)
            .Select(g => new ResponseTimelineDto(g.Key, g.Count()))
            .OrderBy(rt => rt.Date)
            .ToList();

        // Calculate statistics per question
        var questionStatistics = new List<QuestionStatisticsDto>();

        foreach (var question in survey.Questions.OrderBy(q => q.Order))
        {
            var answers = responses
                .SelectMany(r => r.Answers)
                .Where(a => a.QuestionId == question.Id)
                .Select(a => a.AnswerText)
                .ToList();

            var totalAnswers = answers.Count;
            Dictionary<string, int>? optionBreakdown = null;
            double? averageRating = null;
            List<string>? topAnswers = null;

            switch (question.Type)
            {
                case QuestionType.MultipleChoice:
                case QuestionType.Checkboxes:
                    // Count occurrences of each option
                    optionBreakdown = answers
                        .SelectMany(a => a.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
                        .GroupBy(a => a)
                        .ToDictionary(g => g.Key, g => g.Count());
                    break;

                case QuestionType.Rating:
                    // Calculate average rating
                    var ratings = answers
                        .Select(a => double.TryParse(a, out var rating) ? rating : (double?)null)
                        .Where(r => r.HasValue)
                        .Select(r => r!.Value)
                        .ToList();
                    
                    if (ratings.Any())
                    {
                        averageRating = Math.Round(ratings.Average(), 2);
                    }
                    
                    // Also show distribution
                    optionBreakdown = ratings
                        .GroupBy(r => r.ToString())
                        .ToDictionary(g => g.Key, g => g.Count());
                    break;

                case QuestionType.ShortText:
                case QuestionType.LongText:
                case QuestionType.Email:
                    // Show top 5 most common answers
                    topAnswers = answers
                        .Where(a => !string.IsNullOrWhiteSpace(a))
                        .GroupBy(a => a)
                        .OrderByDescending(g => g.Count())
                        .Take(5)
                        .Select(g => g.Key)
                        .ToList();
                    break;

                case QuestionType.Date:
                    // Show date distribution by month/year
                    var dates = answers
                        .Select(a => DateTime.TryParse(a, out var date) ? date : (DateTime?)null)
                        .Where(d => d.HasValue)
                        .Select(d => d!.Value)
                        .ToList();
                    
                    if (dates.Any())
                    {
                        optionBreakdown = dates
                            .GroupBy(d => d.ToString("yyyy-MM"))
                            .ToDictionary(g => g.Key, g => g.Count());
                    }
                    break;
            }

            questionStatistics.Add(new QuestionStatisticsDto(
                question.Id,
                question.Text,
                question.Type.ToString(),
                totalAnswers,
                optionBreakdown,
                averageRating,
                topAnswers
            ));
        }

        return new SurveyAnalyticsDto(
            survey.Id,
            survey.Title,
            totalResponses,
            firstResponseAt,
            lastResponseAt,
            responseTimeline,
            questionStatistics
        );
    }
}
