using AutoMapper;
using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Application.Interfaces;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Queries.Surveys;

public class GetSurveyByIdQueryHandler : IRequestHandler<GetSurveyByIdQuery, SurveyResponseDto>
{
    private readonly ISurveyRepository _surveyRepository;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetSurveyByIdQueryHandler(
        ISurveyRepository surveyRepository,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _surveyRepository = surveyRepository;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<SurveyResponseDto> Handle(GetSurveyByIdQuery request, CancellationToken cancellationToken)
    {
        var survey = await _surveyRepository.GetByIdWithQuestionsAsync(request.Id, cancellationToken);
        
        if (survey == null)
        {
            throw new KeyNotFoundException($"Survey with ID {request.Id} not found.");
        }

        if (survey.UserId != _currentUserService.UserId)
        {
            throw new UnauthorizedAccessException("You are not authorized to view this survey.");
        }

        return _mapper.Map<SurveyResponseDto>(survey);
    }
}
