using Microsoft.EntityFrameworkCore;
using SurveyLite.Domain.Entities;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Infrastructure.Persistence.Repositories;

public class SurveyRepository : Repository<Survey>, ISurveyRepository
{
    public SurveyRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Survey>> GetUserSurveysAsync(
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
            query = query.Where(x => x.Title.Contains(searchTerm) || (x.Description != null && x.Description.Contains(searchTerm)));
        }

        return await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> GetUserSurveysCountAsync(Guid userId, string? searchTerm = null, CancellationToken cancellationToken = default)
    {
        var query = Context.Surveys
            .Where(x => x.UserId == userId);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(x => x.Title.Contains(searchTerm) || (x.Description != null && x.Description.Contains(searchTerm)));
        }

        return await query.CountAsync(cancellationToken);
    }

    public async Task<Survey?> GetByIdWithQuestionsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await Context.Surveys
            .Include(x => x.Questions.OrderBy(q => q.Order))
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }
}
