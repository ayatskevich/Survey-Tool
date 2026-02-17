using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SurveyLite.Application.Interfaces;
using SurveyLite.Domain.Interfaces;
using SurveyLite.Infrastructure.Persistence;
using SurveyLite.Infrastructure.Persistence.Repositories;
using SurveyLite.Infrastructure.Services;

namespace SurveyLite.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString));

        // Repository registrations
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ISurveyRepository, SurveyRepository>();
        services.AddScoped<IResponseRepository, ResponseRepository>();
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

        // Service registrations
        var secretKey = configuration["Jwt:SecretKey"]
            ?? throw new InvalidOperationException("JWT SecretKey not configured.");
        var expirationMinutes = int.TryParse(configuration["Jwt:ExpirationMinutes"], out var minutes) ? minutes : 60;
        
        services.AddSingleton<IJwtService>(new JwtService(secretKey, expirationMinutes));
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IAuthService, AuthService>();

        return services;
    }
}
