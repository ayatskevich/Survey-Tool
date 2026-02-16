using Microsoft.EntityFrameworkCore;
using SurveyLite.Domain.Entities;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Infrastructure.Persistence.Repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await Context.Users
            .FirstOrDefaultAsync(x => x.Email == email.ToLowerInvariant(), cancellationToken);
    }
}
