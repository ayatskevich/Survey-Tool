using SurveyLite.Domain.Entities;

namespace SurveyLite.Domain.Interfaces;

public interface IResponseRepository : IRepository<Response>
{
    Task<IEnumerable<Response>> GetBySurveyIdAsync(Guid surveyId, int page, int pageSize, CancellationToken cancellationToken = default);
    Task<int> GetResponseCountAsync(Guid surveyId, CancellationToken cancellationToken = default);
}
