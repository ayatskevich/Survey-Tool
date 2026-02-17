using AutoMapper;
using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Application.Interfaces;
using SurveyLite.Domain.Entities;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Commands.Surveys;

public class CreateSurveyCommandHandler : IRequestHandler<CreateSurveyCommand, SurveyResponseDto>
{
    private readonly ISurveyRepository _surveyRepository;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public CreateSurveyCommandHandler(
        ISurveyRepository surveyRepository,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _surveyRepository = surveyRepository;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<SurveyResponseDto> Handle(CreateSurveyCommand request, CancellationToken cancellationToken)
    {
        var survey = new Survey(
            _currentUserService.UserId,
            request.Title,
            request.Description ?? string.Empty
        );

        if (request.IsActive)
        {
            survey.Activate();
        }

        await _surveyRepository.AddAsync(survey, cancellationToken);

        return _mapper.Map<SurveyResponseDto>(survey);
    }
}
