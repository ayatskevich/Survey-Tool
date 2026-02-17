using MediatR;
using Microsoft.AspNetCore.Mvc;
using SurveyLite.Application.Commands.Responses;
using SurveyLite.Application.DTOs;
using SurveyLite.Application.Queries.PublicSurveys;

namespace SurveyLite.API.Controllers;

[ApiController]
[Route("api/public/surveys")]
public class PublicSurveysController : ControllerBase
{
    private readonly IMediator _mediator;

    public PublicSurveysController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get a public survey by ID (no authentication required)
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(PublicSurveyDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PublicSurveyDto>> GetPublicSurvey(Guid id, CancellationToken cancellationToken)
    {
        try
        {
            var query = new GetPublicSurveyQuery(id);
            var result = await _mediator.Send(query, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Submit a response to a public survey (no authentication required)
    /// </summary>
    [HttpPost("{surveyId}/responses")]
    [ProducesResponseType(typeof(ResponseSubmissionResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ResponseSubmissionResult>> SubmitResponse(
        Guid surveyId,
        [FromBody] SubmitResponseDto dto,
        CancellationToken cancellationToken)
    {
        try
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            var command = new SubmitResponseCommand(surveyId, dto.RespondentEmail, dto.Answers, ipAddress);
            var result = await _mediator.Send(command, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
