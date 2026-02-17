using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Queries.Dashboard;

public record GetDashboardStatsQuery : IRequest<DashboardStatsDto>;
