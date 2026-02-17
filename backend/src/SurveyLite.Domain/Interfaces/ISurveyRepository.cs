using SurveyLite.Domain.Entities;

namespace SurveyLite.Domain.Interfaces;

public interface ISurveyRepository : IRepository<Survey>
{
    Task<IEnumerable<Survey>> GetUserSurveysAsync(Guid userId, int page, int pageSize, string? searchTerm = null, CancellationToken cancellationToken = default);
    Task<int> GetUserSurveysCountAsync(Guid userId, string? searchTerm = null, CancellationToken cancellationToken = default);
    Task<Survey?> GetByIdWithQuestionsAsync(Guid id, CancellationToken cancellationToken = default);
}
