using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SurveyLite.Application.Commands.Surveys;
using SurveyLite.Application.DTOs;
using SurveyLite.Application.Queries.Surveys;

namespace SurveyLite.API.Controllers;

[ApiController]
[Route("api/admin/surveys")]
[Authorize]
public class SurveyManagementController : ControllerBase
{
    private readonly IMediator _mediator;

    public SurveyManagementController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get list of surveys with optional filters and pagination
    /// </summary>
    [HttpPost("search")]
    public async Task<ActionResult<SurveyPageDto>> GetSurveys(
        [FromBody] SurveyFiltersDto filters,
        CancellationToken cancellationToken)
    {
        try
        {
            var query = new GetSurveysWithFiltersQuery(filters);
            var result = await _mediator.Send(query, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Clone a survey with all its questions
    /// </summary>
    [HttpPost("{surveyId}/clone")]
    public async Task<ActionResult<CloneSurveyResultDto>> CloneSurvey(
        string surveyId,
        [FromBody] CloneSurveyDto dto,
        CancellationToken cancellationToken)
    {
        try
        {
            var command = new CloneSurveyCommand(surveyId, dto.NewTitle);
            var result = await _mediator.Send(command, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Archive or unarchive multiple surveys
    /// </summary>
    [HttpPut("bulk-archive")]
    public async Task<ActionResult<BulkArchiveResultDto>> BulkArchiveSurveys(
        [FromBody] BulkArchiveSurveysDto dto,
        CancellationToken cancellationToken)
    {
        try
        {
            var command = new BulkArchiveSurveysCommand(dto.SurveyIds, dto.Archive);
            var result = await _mediator.Send(command, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
