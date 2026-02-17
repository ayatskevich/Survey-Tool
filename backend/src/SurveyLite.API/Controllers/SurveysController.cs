using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SurveyLite.Application.Commands.Surveys;
using SurveyLite.Application.DTOs;
using SurveyLite.Application.Queries.Surveys;

namespace SurveyLite.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SurveysController : ControllerBase
{
    private readonly IMediator _mediator;

    public SurveysController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all surveys for the authenticated user
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedResult<SurveyListDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<PaginatedResult<SurveyListDto>>> GetSurveys(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchTerm = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetSurveysQuery(page, pageSize, searchTerm);
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Get a specific survey by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(SurveyResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<SurveyResponseDto>> GetSurveyById(
        Guid id,
        CancellationToken cancellationToken)
    {
        try
        {
            var query = new GetSurveyByIdQuery(id);
            var result = await _mediator.Send(query, cancellationToken);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid();
        }
    }

    /// <summary>
    /// Create a new survey
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(SurveyResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<SurveyResponseDto>> CreateSurvey(
        [FromBody] CreateSurveyCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetSurveyById), new { id = result.Id }, result);
    }

    /// <summary>
    /// Update an existing survey
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(SurveyResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<SurveyResponseDto>> UpdateSurvey(
        Guid id,
        [FromBody] UpdateSurveyCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.Id)
        {
            return BadRequest(new { error = "ID in URL does not match ID in request body" });
        }

        try
        {
            var result = await _mediator.Send(command, cancellationToken);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid();
        }
    }

    /// <summary>
    /// Delete a survey
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteSurvey(
        Guid id,
        CancellationToken cancellationToken)
    {
        try
        {
            var command = new DeleteSurveyCommand(id);
            await _mediator.Send(command, cancellationToken);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid();
        }
    }

    /// <summary>
    /// Toggle survey active/inactive status
    /// </summary>
    [HttpPatch("{id}/status")]
    [ProducesResponseType(typeof(SurveyResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<SurveyResponseDto>> ToggleSurveyStatus(
        Guid id,
        CancellationToken cancellationToken)
    {
        try
        {
            // Get current survey
            var query = new GetSurveyByIdQuery(id);
            var survey = await _mediator.Send(query, cancellationToken);
            
            // Update with toggled status
            var command = new UpdateSurveyCommand(
                survey.Id,
                survey.Title,
                survey.Description,
                !survey.IsActive
            );
            
            var result = await _mediator.Send(command, cancellationToken);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid();
        }
    }
}
