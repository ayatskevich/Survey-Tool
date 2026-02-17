using AutoMapper;
using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Application.Interfaces;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Queries.Questions;

public class GetQuestionsQueryHandler : IRequestHandler<GetQuestionsQuery, IEnumerable<QuestionDto>>
{
    private readonly ISurveyRepository _surveyRepository;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public GetQuestionsQueryHandler(
        ISurveyRepository surveyRepository,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _surveyRepository = surveyRepository;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<IEnumerable<QuestionDto>> Handle(GetQuestionsQuery request, CancellationToken cancellationToken)
    {
        var survey = await _surveyRepository.GetByIdWithQuestionsAsync(request.SurveyId, cancellationToken);
        
        if (survey == null)
        {
            throw new KeyNotFoundException($"Survey with ID {request.SurveyId} not found.");
        }

        if (survey.UserId != _currentUserService.UserId)
        {
            throw new UnauthorizedAccessException("You are not authorized to view questions for this survey.");
        }

        var questions = survey.Questions.OrderBy(q => q.Order);
        return _mapper.Map<IEnumerable<QuestionDto>>(questions);
    }
}
