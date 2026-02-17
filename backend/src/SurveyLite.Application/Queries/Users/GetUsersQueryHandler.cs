using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Domain.Enums;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Queries.Users;

public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, UserPageDto>
{
    private readonly IUserRepository _userRepository;
    private readonly ISurveyRepository _surveyRepository;
    private readonly IResponseRepository _responseRepository;

    public GetUsersQueryHandler(
        IUserRepository userRepository,
        ISurveyRepository surveyRepository,
        IResponseRepository responseRepository)
    {
        _userRepository = userRepository;
        _surveyRepository = surveyRepository;
        _responseRepository = responseRepository;
    }

    public async Task<UserPageDto> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var filters = request.Filters;

        // Get all users
        var allUsers = await _userRepository.GetAllAsync(cancellationToken);

        // Apply filters
        var filteredUsers = allUsers.AsEnumerable();

        // Search by email, first name, or last name
        if (!string.IsNullOrWhiteSpace(filters.SearchTerm))
        {
            var searchTerm = filters.SearchTerm.ToLower();
            filteredUsers = filteredUsers.Where(u =>
                u.Email.ToLower().Contains(searchTerm) ||
                u.FirstName.ToLower().Contains(searchTerm) ||
                u.LastName.ToLower().Contains(searchTerm));
        }

        // Filter by role
        if (!string.IsNullOrWhiteSpace(filters.Role))
        {
            if (Enum.TryParse<UserRole>(filters.Role, ignoreCase: true, out var roleEnum))
            {
                filteredUsers = filteredUsers.Where(u => u.Role == roleEnum);
            }
        }

        // Filter by active status
        if (filters.IsActive.HasValue)
        {
            filteredUsers = filteredUsers.Where(u => u.IsActive == filters.IsActive.Value);
        }

        // Filter by creation date range
        if (filters.CreatedFromDate.HasValue)
        {
            filteredUsers = filteredUsers.Where(u => u.CreatedAt >= filters.CreatedFromDate.Value);
        }

        if (filters.CreatedToDate.HasValue)
        {
            var toDate = filters.CreatedToDate.Value.AddDays(1).AddTicks(-1);
            filteredUsers = filteredUsers.Where(u => u.CreatedAt <= toDate);
        }

        // Apply sorting
        filteredUsers = ApplySorting(filteredUsers, filters.SortBy, filters.SortDescending);

        var totalCount = filteredUsers.Count();

        // Apply pagination
        var paginatedUsers = filteredUsers
            .Skip((filters.Page - 1) * filters.PageSize)
            .Take(filters.PageSize)
            .ToList();

        // Map to DTOs with survey and response counts
        var userDtos = new List<AdminUserDto>();
        foreach (var user in paginatedUsers)
        {
            var surveys = await _surveyRepository.GetUserSurveysAsync(user.Id, 1, int.MaxValue, null, cancellationToken);
            var surveyCount = surveys.Count();

            var responses = new List<Domain.Entities.Response>();
            foreach (var survey in surveys)
            {
                var surveyResponses = await _responseRepository.GetAllBySurveyIdWithAnswersAsync(survey.Id, cancellationToken);
                responses.AddRange(surveyResponses);
            }

            userDtos.Add(new AdminUserDto
            {
                Id = user.Id.ToString(),
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role.ToString(),
                IsActive = user.IsActive,
                SurveyCount = surveyCount,
                ResponseCount = responses.Count(),
                CreatedAt = user.CreatedAt,
                LastLoginAt = user.LastLoginAt
            });
        }

        return new UserPageDto
        {
            Items = userDtos,
            TotalCount = totalCount,
            Page = filters.Page,
            PageSize = filters.PageSize
        };
    }

    private IEnumerable<Domain.Entities.User> ApplySorting(
        IEnumerable<Domain.Entities.User> users,
        string sortBy,
        bool sortDescending)
    {
        var sorted = sortBy?.ToLower() switch
        {
            "email" => sortDescending
                ? users.OrderByDescending(u => u.Email)
                : users.OrderBy(u => u.Email),
            "firstname" => sortDescending
                ? users.OrderByDescending(u => u.FirstName)
                : users.OrderBy(u => u.FirstName),
            "lastname" => sortDescending
                ? users.OrderByDescending(u => u.LastName)
                : users.OrderBy(u => u.LastName),
            "role" => sortDescending
                ? users.OrderByDescending(u => u.Role)
                : users.OrderBy(u => u.Role),
            "createdat" => sortDescending
                ? users.OrderByDescending(u => u.CreatedAt)
                : users.OrderBy(u => u.CreatedAt),
            _ => sortDescending
                ? users.OrderByDescending(u => u.CreatedAt)
                : users.OrderBy(u => u.CreatedAt)
        };

        return sorted;
    }
}
