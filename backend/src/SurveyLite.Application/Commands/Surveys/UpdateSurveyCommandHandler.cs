using AutoMapper;
using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Application.Interfaces;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Commands.Surveys;

public class UpdateSurveyCommandHandler : IRequestHandler<UpdateSurveyCommand, SurveyResponseDto>
{
    private readonly ISurveyRepository _surveyRepository;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public UpdateSurveyCommandHandler(
        ISurveyRepository surveyRepository,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _surveyRepository = surveyRepository;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<SurveyResponseDto> Handle(UpdateSurveyCommand request, CancellationToken cancellationToken)
    {
        var survey = await _surveyRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (survey == null)
        {
            throw new KeyNotFoundException($"Survey with ID {request.Id} not found.");
        }

        if (survey.UserId != _currentUserService.UserId)
        {
            throw new UnauthorizedAccessException("You are not authorized to update this survey.");
        }

        survey.Update(request.Title, request.Description ?? string.Empty);

        if (request.IsActive)
        {
            survey.Activate();
        }
        else
        {
            survey.Deactivate();
        }

        await _surveyRepository.UpdateAsync(survey, cancellationToken);

        return _mapper.Map<SurveyResponseDto>(survey);
    }
}
