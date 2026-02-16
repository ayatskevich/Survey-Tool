using Microsoft.EntityFrameworkCore;
using SurveyLite.Domain.Entities;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Infrastructure.Persistence.Repositories;

public class SurveyRepository : Repository<Survey>, ISurveyRepository
{
    public SurveyRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Survey>> GetByUserIdAsync(
        Guid userId,
        int page,
        int pageSize,
        string? searchTerm = null,
        CancellationToken cancellationToken = default)
    {
        var query = Context.Surveys
            .Where(x => x.UserId == userId)
            .Include(x => x.Questions)
            .Include(x => x.Responses)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(x => x.Title.Contains(searchTerm) || x.Description.Contains(searchTerm));
        }

        return await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> GetUserSurveyCountAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await Context.Surveys
            .CountAsync(x => x.UserId == userId, cancellationToken);
    }
}
