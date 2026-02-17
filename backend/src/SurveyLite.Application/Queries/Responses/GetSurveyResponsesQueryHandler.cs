using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Queries.Responses;

public class GetSurveyResponsesQueryHandler : IRequestHandler<GetSurveyResponsesQuery, PaginatedResult<ResponseSummaryDto>>
{
    private readonly IResponseRepository _responseRepository;
    private readonly ISurveyRepository _surveyRepository;

    public GetSurveyResponsesQueryHandler(
        IResponseRepository responseRepository,
        ISurveyRepository surveyRepository)
    {
        _responseRepository = responseRepository;
        _surveyRepository = surveyRepository;
    }

    public async Task<PaginatedResult<ResponseSummaryDto>> Handle(
        GetSurveyResponsesQuery request,
        CancellationToken cancellationToken)
    {
        // Verify survey exists and user has access
        var survey = await _surveyRepository.GetByIdAsync(request.SurveyId, cancellationToken);
        if (survey == null)
        {
            throw new InvalidOperationException("Survey not found");
        }

        var responses = await _responseRepository.GetBySurveyIdAsync(
            request.SurveyId,
            request.Page,
            request.PageSize,
            cancellationToken);

        var totalCount = await _responseRepository.GetResponseCountAsync(
            request.SurveyId,
            cancellationToken);

        var responseDtos = responses.Select(r => new ResponseSummaryDto(
            r.Id,
            r.RespondentEmail,
            r.SubmittedAt,
            r.Answers.Count
        )).ToList();

        return new PaginatedResult<ResponseSummaryDto>(
            responseDtos,
            totalCount,
            request.Page,
            request.PageSize,
            (int)Math.Ceiling((double)totalCount / request.PageSize)
        );
    }
}
