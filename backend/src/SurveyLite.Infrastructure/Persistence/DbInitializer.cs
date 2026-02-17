using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SurveyLite.Domain.Entities;
using SurveyLite.Domain.Enums;

namespace SurveyLite.Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context, IConfiguration configuration)
    {
        // Check if users already exist
        if (await context.Users.AnyAsync())
        {
            return; // DB has been seeded
        }

        // Hash password helper (using BCrypt)
        string HashPassword(string password) => 
            BCrypt.Net.BCrypt.HashPassword(password, BCrypt.Net.BCrypt.GenerateSalt(12));

        // Create test users
        var testUser = new User(
            "test@example.com",
            HashPassword("Test123!"),
            "Test",
            "User",
            UserRole.User
        );

        var adminUser = new User(
            "admin@example.com",
            HashPassword("Admin123!"),
            "Admin",
            "User",
            UserRole.Admin
        );

        context.Users.AddRange(testUser, adminUser);
        await context.SaveChangesAsync();

        Console.WriteLine("Database seeded successfully!");
        Console.WriteLine("Test User - Email: test@example.com, Password: Test123!");
        Console.WriteLine("Admin User - Email: admin@example.com, Password: Admin123!");
    }
}
