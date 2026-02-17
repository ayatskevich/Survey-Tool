using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Application.Interfaces;

namespace SurveyLite.Application.Queries.Users;

public class GetUserSessionsQueryHandler : IRequestHandler<GetUserSessionsQuery, List<UserSessionDto>>
{
    private readonly ICurrentUserService _currentUserService;

    public GetUserSessionsQueryHandler(ICurrentUserService currentUserService)
    {
        _currentUserService = currentUserService;
    }

    public Task<List<UserSessionDto>> Handle(
        GetUserSessionsQuery request,
        CancellationToken cancellationToken)
    {
        // Return current session as primary
        // In a production app, this would fetch from a session store (Redis, database, etc)
        var sessions = new List<UserSessionDto>
        {
            new UserSessionDto(
                Guid.NewGuid().ToString(),
                "API Session",
                DateTime.UtcNow,
                true
            )
        };

        return Task.FromResult(sessions);
    }
}
