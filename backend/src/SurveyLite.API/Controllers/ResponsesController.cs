using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SurveyLite.Application.DTOs;
using SurveyLite.Application.Queries.Responses;

namespace SurveyLite.API.Controllers;

[Authorize]
[ApiController]
[Route("api/surveys/{surveyId}/responses")]
public class ResponsesController : ControllerBase
{
    private readonly IMediator _mediator;

    public ResponsesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all responses for a survey (paginated)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedResult<ResponseSummaryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetResponses(
        [FromRoute] Guid surveyId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var query = new GetSurveyResponsesQuery(surveyId, page, pageSize);
            var result = await _mediator.Send(query, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Get a single response by ID
    /// </summary>
    [HttpGet("{responseId}")]
    [ProducesResponseType(typeof(ResponseDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetResponse(
        [FromRoute] Guid surveyId,
        [FromRoute] Guid responseId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var query = new GetResponseByIdQuery(surveyId, responseId);
            var result = await _mediator.Send(query, cancellationToken);
            
            if (result == null)
            {
                return NotFound(new { error = "Response not found" });
            }

            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Get analytics for a survey
    /// </summary>
    [HttpGet("~/api/surveys/{surveyId}/analytics")]
    [ProducesResponseType(typeof(SurveyAnalyticsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAnalytics(
        [FromRoute] Guid surveyId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var query = new GetSurveyAnalyticsQuery(surveyId);
            var result = await _mediator.Send(query, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Export survey responses as CSV
    /// </summary>
    [HttpGet("~/api/surveys/{surveyId}/export")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ExportResponses(
        [FromRoute] Guid surveyId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var query = new ExportSurveyResponsesQuery(surveyId);
            var csvData = await _mediator.Send(query, cancellationToken);
            
            return File(
                csvData,
                "text/csv",
                $"survey-{surveyId}-responses-{DateTime.UtcNow:yyyyMMddHHmmss}.csv");
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }
}
