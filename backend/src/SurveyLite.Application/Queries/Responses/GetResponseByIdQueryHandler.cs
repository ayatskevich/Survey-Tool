using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Queries.Responses;

public class GetResponseByIdQueryHandler : IRequestHandler<GetResponseByIdQuery, ResponseDetailDto?>
{
    private readonly IResponseRepository _responseRepository;
    private readonly ISurveyRepository _surveyRepository;

    public GetResponseByIdQueryHandler(
        IResponseRepository responseRepository,
        ISurveyRepository surveyRepository)
    {
        _responseRepository = responseRepository;
        _surveyRepository = surveyRepository;
    }

    public async Task<ResponseDetailDto?> Handle(
        GetResponseByIdQuery request,
        CancellationToken cancellationToken)
    {
        // Verify survey exists
        var survey = await _surveyRepository.GetByIdAsync(request.SurveyId, cancellationToken);
        if (survey == null)
        {
            throw new InvalidOperationException("Survey not found");
        }

        var response = await _responseRepository.GetByIdWithAnswersAsync(
            request.ResponseId,
            request.SurveyId,
            cancellationToken);

        if (response == null)
        {
            return null;
        }

        var answers = response.Answers
            .OrderBy(a => a.Question.Order)
            .Select(a => new ResponseAnswerDto(
                a.QuestionId,
                a.Question.Text,
                a.Question.Type.ToString(),
                a.AnswerText
            ))
            .ToList();

        return new ResponseDetailDto(
            response.Id,
            response.SurveyId,
            response.RespondentEmail,
            response.IpAddress,
            response.SubmittedAt,
            answers
        );
    }
}
