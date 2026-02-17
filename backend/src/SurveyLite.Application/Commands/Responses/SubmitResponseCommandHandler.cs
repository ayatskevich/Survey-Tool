using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Domain.Entities;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Commands.Responses;

public class SubmitResponseCommandHandler : IRequestHandler<SubmitResponseCommand, ResponseSubmissionResult>
{
    private readonly ISurveyRepository _surveyRepository;
    private readonly IResponseRepository _responseRepository;

    public SubmitResponseCommandHandler(
        ISurveyRepository surveyRepository,
        IResponseRepository responseRepository)
    {
        _surveyRepository = surveyRepository;
        _responseRepository = responseRepository;
    }

    public async Task<ResponseSubmissionResult> Handle(SubmitResponseCommand request, CancellationToken cancellationToken)
    {
        // Get survey and validate it's active
        var survey = await _surveyRepository.GetByIdWithQuestionsAsync(request.SurveyId, cancellationToken);
        
        if (survey == null || !survey.IsActive)
            throw new InvalidOperationException("Survey not found or not active");

        // Validate all required questions are answered
        var requiredQuestions = survey.Questions.Where(q => q.IsRequired).Select(q => q.Id).ToHashSet();
        var answeredQuestions = request.Answers.Select(a => a.QuestionId).ToHashSet();
        
        var missingRequired = requiredQuestions.Except(answeredQuestions);
        if (missingRequired.Any())
            throw new InvalidOperationException($"Required questions not answered: {string.Join(", ", missingRequired)}");

        // Validate all answered questions belong to this survey
        var validQuestionIds = survey.Questions.Select(q => q.Id).ToHashSet();
        var invalidQuestions = answeredQuestions.Except(validQuestionIds);
        if (invalidQuestions.Any())
            throw new InvalidOperationException($"Invalid question IDs: {string.Join(", ", invalidQuestions)}");

        // Create response
        var response = new Response(request.SurveyId, request.RespondentEmail, request.IpAddress);

        // Add answers
        foreach (var answerDto in request.Answers)
        {
            var answer = new Answer(response.Id, answerDto.QuestionId, answerDto.AnswerText);
            response.AddAnswer(answer);
        }

        // Save to database
        await _responseRepository.AddAsync(response, cancellationToken);

        return new ResponseSubmissionResult(response.Id, response.SubmittedAt);
    }
}
