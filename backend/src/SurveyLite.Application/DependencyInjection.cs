using Microsoft.Extensions.DependencyInjection;
using SurveyLite.Application.Mappings;
using FluentValidation;
using MediatR;

namespace SurveyLite.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(typeof(MappingProfile));
        services.AddValidatorsFromAssemblyContaining(typeof(DependencyInjection));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining(typeof(DependencyInjection)));

        return services;
    }
}
