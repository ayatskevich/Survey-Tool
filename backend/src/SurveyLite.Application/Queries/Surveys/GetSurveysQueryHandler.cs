using AutoMapper;
using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Application.Interfaces;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Queries.Surveys;

public class GetSurveysQueryHandler : IRequestHandler<GetSurveysQuery, PaginatedResult<SurveyListDto>>
{
    private readonly ISurveyRepository _surveyRepository;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetSurveysQueryHandler(
        ISurveyRepository surveyRepository,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _surveyRepository = surveyRepository;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<PaginatedResult<SurveyListDto>> Handle(GetSurveysQuery request, CancellationToken cancellationToken)
    {
        var surveys = await _surveyRepository.GetUserSurveysAsync(
            _currentUserService.UserId,
            request.Page,
            request.PageSize,
            request.SearchTerm,
            cancellationToken);

        var totalCount = await _surveyRepository.GetUserSurveysCountAsync(
            _currentUserService.UserId,
            request.SearchTerm,
            cancellationToken);

        var surveyDtos = _mapper.Map<IEnumerable<SurveyListDto>>(surveys);

        return new PaginatedResult<SurveyListDto>(
            surveyDtos,
            totalCount,
            request.Page,
            request.PageSize,
            (int)Math.Ceiling((double)totalCount / request.PageSize)
        );
    }
}
