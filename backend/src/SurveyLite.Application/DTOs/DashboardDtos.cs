namespace SurveyLite.Application.DTOs;

// Main dashboard statistics DTO
public record DashboardStatsDto(
    SurveyStatsDto SurveyStats,
    ResponseStatsDto ResponseStats,
    List<RecentSurveyDto> RecentSurveys,
    List<RecentResponseDto> RecentResponses,
    List<ActivityTrendDto> ActivityTrend,
    List<TopSurveyDto> TopSurveys
);

// Survey statistics summary
public record SurveyStatsDto(
    int TotalSurveys,
    int ActiveSurveys,
    int TotalResponses
);

// Response statistics summary
public record ResponseStatsDto(
    int TotalResponses,
    int ResponsesThisMonth,
    double AveragePerSurvey
);

// Recent survey for dashboard (last 5)
public record RecentSurveyDto(
    Guid Id,
    string Title,
    DateTime CreatedAt,
    int ResponseCount
);

// Recent response for dashboard (last 5)
public record RecentResponseDto(
    Guid Id,
    Guid SurveyId,
    string SurveyTitle,
    string? RespondentEmail,
    DateTime SubmittedAt
);

// Activity trend data point (for charts)
public record ActivityTrendDto(
    string Date,  // Format: "yyyy-MM-dd"
    int ResponseCount
);

// Top survey by response count
public record TopSurveyDto(
    Guid Id,
    string Title,
    int ResponseCount
);
