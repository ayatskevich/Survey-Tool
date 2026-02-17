using AutoMapper;
using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Application.Interfaces;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Commands.Questions;

public class UpdateQuestionCommandHandler : IRequestHandler<UpdateQuestionCommand, QuestionDto>
{
    private readonly ISurveyRepository _surveyRepository;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public UpdateQuestionCommandHandler(
        ISurveyRepository surveyRepository,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _surveyRepository = surveyRepository;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<QuestionDto> Handle(UpdateQuestionCommand request, CancellationToken cancellationToken)
    {
        var survey = await _surveyRepository.GetByIdWithQuestionsAsync(request.SurveyId, cancellationToken);
        
        if (survey == null)
        {
            throw new KeyNotFoundException($"Survey with ID {request.SurveyId} not found.");
        }

        if (survey.UserId != _currentUserService.UserId)
        {
            throw new UnauthorizedAccessException("You are not authorized to update questions in this survey.");
        }

        var question = survey.Questions.FirstOrDefault(q => q.Id == request.QuestionId);
        
        if (question == null)
        {
            throw new KeyNotFoundException($"Question with ID {request.QuestionId} not found in this survey.");
        }

        question.Update(request.Text, request.IsRequired, request.Options, request.ValidationRules);

        await _surveyRepository.UpdateAsync(survey, cancellationToken);

        return _mapper.Map<QuestionDto>(question);
    }
}
