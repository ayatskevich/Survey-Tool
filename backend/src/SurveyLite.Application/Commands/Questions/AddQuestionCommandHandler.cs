using AutoMapper;
using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Application.Interfaces;
using SurveyLite.Domain.Entities;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Commands.Questions;

public class AddQuestionCommandHandler : IRequestHandler<AddQuestionCommand, QuestionDto>
{
    private readonly ISurveyRepository _surveyRepository;
    private readonly IRepository<Question> _questionRepository;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public AddQuestionCommandHandler(
        ISurveyRepository surveyRepository,
        IRepository<Question> questionRepository,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _surveyRepository = surveyRepository;
        _questionRepository = questionRepository;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<QuestionDto> Handle(AddQuestionCommand request, CancellationToken cancellationToken)
    {
        var survey = await _surveyRepository.GetByIdAsync(request.SurveyId, cancellationToken);
        
        if (survey == null)
        {
            throw new KeyNotFoundException($"Survey with ID {request.SurveyId} not found.");
        }

        if (survey.UserId != _currentUserService.UserId)
        {
            throw new UnauthorizedAccessException("You are not authorized to add questions to this survey.");
        }

        var question = new Question(
            request.SurveyId,
            request.Type,
            request.Text,
            request.Order,
            request.IsRequired
        );

        if (!string.IsNullOrWhiteSpace(request.Options))
        {
            question.SetOptions(request.Options);
        }

        if (!string.IsNullOrWhiteSpace(request.ValidationRules))
        {
            question.SetValidationRules(request.ValidationRules);
        }

        // Add question directly to repository without loading survey's questions collection
        // This avoids concurrency issues with tracked entities
        await _questionRepository.AddAsync(question, cancellationToken);

        return _mapper.Map<QuestionDto>(question);
    }
}
