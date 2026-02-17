using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Application.Interfaces;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Queries.Dashboard;

public class GetDashboardStatsQueryHandler : IRequestHandler<GetDashboardStatsQuery, DashboardStatsDto>
{
    private readonly ISurveyRepository _surveyRepository;
    private readonly IResponseRepository _responseRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetDashboardStatsQueryHandler(
        ISurveyRepository surveyRepository,
        IResponseRepository responseRepository,
        ICurrentUserService currentUserService)
    {
        _surveyRepository = surveyRepository;
        _responseRepository = responseRepository;
        _currentUserService = currentUserService;
    }

    public async Task<DashboardStatsDto> Handle(
        GetDashboardStatsQuery request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        var now = DateTime.UtcNow;
        var monthStart = new DateTime(now.Year, now.Month, 1);

        // Get user's surveys
        var allSurveys = await _surveyRepository.GetUserSurveysAsync(
            userId, 1, int.MaxValue, null, cancellationToken);
        var surveyIds = allSurveys.Select(s => s.Id).ToList();

        // Get all responses for user's surveys
        var allResponses = new List<Domain.Entities.Response>();
        foreach (var surveyId in surveyIds)
        {
            var responses = await _responseRepository.GetAllBySurveyIdWithAnswersAsync(surveyId, cancellationToken);
            allResponses.AddRange(responses);
        }

        // Survey Stats
        var totalSurveys = surveyIds.Count;
        var activeSurveys = allSurveys.Count(s => s.IsActive);
        var totalResponses = allResponses.Count;

        // Response Stats
        var responsesThisMonth = allResponses.Count(r => r.SubmittedAt >= monthStart);
        var averagePerSurvey = totalSurveys > 0 ? (double)totalResponses / totalSurveys : 0;

        // Recent surveys (last 5, newest first)
        var recentSurveys = allSurveys
            .OrderByDescending(s => s.CreatedAt)
            .Take(5)
            .Select(s => new RecentSurveyDto(
                s.Id,
                s.Title,
                s.CreatedAt,
                allResponses.Count(r => r.SurveyId == s.Id)
            ))
            .ToList();

        // Recent responses (last 5, newest first)
        var recentResponses = allResponses
            .OrderByDescending(r => r.SubmittedAt)
            .Take(5)
            .Select(r => new RecentResponseDto(
                r.Id,
                r.SurveyId,
                allSurveys.FirstOrDefault(s => s.Id == r.SurveyId)?.Title ?? "Unknown Survey",
                r.RespondentEmail,
                r.SubmittedAt
            ))
            .ToList();

        // Activity trend (last 30 days, responses per day)
        var activityTrend = GetActivityTrend(allResponses, now);

        // Top surveys (by response count, top 5)
        var topSurveys = allSurveys
            .Select(s => new TopSurveyDto(
                s.Id,
                s.Title,
                allResponses.Count(r => r.SurveyId == s.Id)
            ))
            .OrderByDescending(ts => ts.ResponseCount)
            .Take(5)
            .ToList();

        return new DashboardStatsDto(
            new SurveyStatsDto(totalSurveys, activeSurveys, totalResponses),
            new ResponseStatsDto(totalResponses, responsesThisMonth, Math.Round(averagePerSurvey, 2)),
            recentSurveys,
            recentResponses,
            activityTrend,
            topSurveys
        );
    }

    private List<ActivityTrendDto> GetActivityTrend(List<Domain.Entities.Response> responses, DateTime now)
    {
        var trend = new Dictionary<string, int>();

        // Initialize last 30 days
        for (int i = 29; i >= 0; i--)
        {
            var date = now.AddDays(-i).Date;
            trend[date.ToString("yyyy-MM-dd")] = 0;
        }

        // Count responses by date
        foreach (var response in responses)
        {
            var dateKey = response.SubmittedAt.Date.ToString("yyyy-MM-dd");
            if (trend.ContainsKey(dateKey))
            {
                trend[dateKey]++;
            }
        }

        return trend
            .OrderBy(kvp => kvp.Key)
            .Select(kvp => new ActivityTrendDto(kvp.Key, kvp.Value))
            .ToList();
    }
}
