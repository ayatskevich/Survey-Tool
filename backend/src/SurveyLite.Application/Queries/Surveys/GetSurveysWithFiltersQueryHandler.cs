using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Queries.Surveys;

public class GetSurveysWithFiltersQueryHandler : IRequestHandler<GetSurveysWithFiltersQuery, SurveyPageDto>
{
    private readonly ISurveyRepository _surveyRepository;
    private readonly IResponseRepository _responseRepository;

    public GetSurveysWithFiltersQueryHandler(
        ISurveyRepository surveyRepository,
        IResponseRepository responseRepository)
    {
        _surveyRepository = surveyRepository;
        _responseRepository = responseRepository;
    }

    public async Task<SurveyPageDto> Handle(GetSurveysWithFiltersQuery request, CancellationToken cancellationToken)
    {
        var filters = request.Filters;

        // Get all surveys
        var allSurveys = await _surveyRepository.GetAllAsync(cancellationToken);

        // Apply filters
        var filteredSurveys = allSurveys.AsEnumerable();

        // Search by title or description
        if (!string.IsNullOrWhiteSpace(filters.SearchTerm))
        {
            var searchTerm = filters.SearchTerm.ToLower();
            filteredSurveys = filteredSurveys.Where(s =>
                s.Title.ToLower().Contains(searchTerm) ||
                s.Description.ToLower().Contains(searchTerm));
        }

        // Filter by active status
        if (filters.IsActive.HasValue)
        {
            filteredSurveys = filteredSurveys.Where(s => s.IsActive == filters.IsActive.Value);
        }

        // Filter by archived status
        if (filters.IsArchived.HasValue)
        {
            filteredSurveys = filteredSurveys.Where(s => s.IsArchived == filters.IsArchived.Value);
        }

        // Filter by creation date range
        if (filters.CreatedFromDate.HasValue)
        {
            filteredSurveys = filteredSurveys.Where(s => s.CreatedAt >= filters.CreatedFromDate.Value);
        }

        if (filters.CreatedToDate.HasValue)
        {
            var toDate = filters.CreatedToDate.Value.AddDays(1).AddTicks(-1);
            filteredSurveys = filteredSurveys.Where(s => s.CreatedAt <= toDate);
        }

        // Apply sorting
        filteredSurveys = ApplySorting(filteredSurveys, filters.SortBy, filters.SortDescending);

        var totalCount = filteredSurveys.Count();

        // Apply pagination
        var paginatedSurveys = filteredSurveys
            .Skip((filters.Page - 1) * filters.PageSize)
            .Take(filters.PageSize)
            .ToList();

        // Map to DTOs with response counts
        var surveyDtos = new List<SurveyItemDto>();
        foreach (var survey in paginatedSurveys)
        {
            var responses = await _responseRepository.GetAllBySurveyIdWithAnswersAsync(survey.Id, cancellationToken);

            surveyDtos.Add(new SurveyItemDto
            {
                Id = survey.Id.ToString(),
                Title = survey.Title,
                Description = survey.Description,
                IsActive = survey.IsActive,
                IsArchived = survey.IsArchived,
                ResponseCount = responses.Count(),
                CreatedAt = survey.CreatedAt,
                UpdatedAt = survey.UpdatedAt,
                PublishedAt = survey.PublishedAt
            });
        }

        return new SurveyPageDto
        {
            Items = surveyDtos,
            TotalCount = totalCount,
            Page = filters.Page,
            PageSize = filters.PageSize
        };
    }

    private IEnumerable<Domain.Entities.Survey> ApplySorting(
        IEnumerable<Domain.Entities.Survey> surveys,
        string sortBy,
        bool sortDescending)
    {
        var sorted = sortBy?.ToLower() switch
        {
            "title" => sortDescending
                ? surveys.OrderByDescending(s => s.Title)
                : surveys.OrderBy(s => s.Title),
            "isactive" => sortDescending
                ? surveys.OrderByDescending(s => s.IsActive)
                : surveys.OrderBy(s => s.IsActive),
            "isarchived" => sortDescending
                ? surveys.OrderByDescending(s => s.IsArchived)
                : surveys.OrderBy(s => s.IsArchived),
            "respondecount" => sortDescending
                ? surveys.OrderByDescending(s => s.Responses.Count)
                : surveys.OrderBy(s => s.Responses.Count),
            "updatedat" => sortDescending
                ? surveys.OrderByDescending(s => s.UpdatedAt ?? s.CreatedAt)
                : surveys.OrderBy(s => s.UpdatedAt ?? s.CreatedAt),
            _ => sortDescending
                ? surveys.OrderByDescending(s => s.CreatedAt)
                : surveys.OrderBy(s => s.CreatedAt)
        };

        return sorted;
    }
}
