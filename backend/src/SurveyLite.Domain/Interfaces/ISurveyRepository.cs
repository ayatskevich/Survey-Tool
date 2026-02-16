using SurveyLite.Domain.Entities;

namespace SurveyLite.Domain.Interfaces;

public interface ISurveyRepository : IRepository<Survey>
{
    Task<IEnumerable<Survey>> GetByUserIdAsync(Guid userId, int page, int pageSize, string? searchTerm = null, CancellationToken cancellationToken = default);
    Task<int> GetUserSurveyCountAsync(Guid userId, CancellationToken cancellationToken = default);
}
