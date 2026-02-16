using Microsoft.EntityFrameworkCore;
using SurveyLite.Domain.Entities;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Infrastructure.Persistence.Repositories;

public class ResponseRepository : Repository<Response>, IResponseRepository
{
    public ResponseRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Response>> GetBySurveyIdAsync(
        Guid surveyId,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        return await Context.Responses
            .Where(x => x.SurveyId == surveyId)
            .Include(x => x.Answers)
            .OrderByDescending(x => x.SubmittedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> GetResponseCountAsync(Guid surveyId, CancellationToken cancellationToken = default)
    {
        return await Context.Responses
            .CountAsync(x => x.SurveyId == surveyId, cancellationToken);
    }
}
