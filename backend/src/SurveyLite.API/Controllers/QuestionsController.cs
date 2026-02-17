using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SurveyLite.Application.Commands.Questions;
using SurveyLite.Application.DTOs;
using SurveyLite.Application.Queries.Questions;

namespace SurveyLite.API.Controllers;

/// <summary>
/// Manages survey questions
/// </summary>
[ApiController]
[Route("api/surveys/{surveyId:guid}/questions")]
[Authorize]
public class QuestionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public QuestionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets all questions for a survey
    /// </summary>
    /// <param name="surveyId">Survey identifier</param>
    /// <returns>List of questions ordered by their order property</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<QuestionDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetQuestions(Guid surveyId)
    {
        try
        {
            var query = new GetQuestionsQuery(surveyId);
            var questions = await _mediator.Send(query);
            return Ok(questions);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Survey not found" });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    /// <summary>
    /// Adds a new question to a survey
    /// </summary>
    /// <param name="surveyId">Survey identifier</param>
    /// <param name="request">Question details</param>
    /// <returns>The created question</returns>
    [HttpPost]
    [ProducesResponseType(typeof(QuestionDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AddQuestion(Guid surveyId, [FromBody] CreateQuestionDto request)
    {
        try
        {
            var command = new AddQuestionCommand(
                surveyId,
                request.Type,
                request.Text,
                request.Order,
                request.IsRequired,
                request.Options,
                request.ValidationRules
            );

            var question = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetQuestions), new { surveyId }, question);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Survey not found" });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Updates an existing question
    /// </summary>
    /// <param name="surveyId">Survey identifier</param>
    /// <param name="questionId">Question identifier</param>
    /// <param name="request">Updated question details</param>
    /// <returns>The updated question</returns>
    [HttpPut("{questionId:guid}")]
    [ProducesResponseType(typeof(QuestionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateQuestion(
        Guid surveyId,
        Guid questionId,
        [FromBody] UpdateQuestionDto request)
    {
        try
        {
            var command = new UpdateQuestionCommand(
                surveyId,
                questionId,
                request.Text,
                request.IsRequired,
                request.Options,
                request.ValidationRules
            );

            var question = await _mediator.Send(command);
            return Ok(question);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Deletes a question from a survey
    /// </summary>
    /// <param name="surveyId">Survey identifier</param>
    /// <param name="questionId">Question identifier</param>
    /// <returns>No content on success</returns>
    [HttpDelete("{questionId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteQuestion(Guid surveyId, Guid questionId)
    {
        try
        {
            var command = new DeleteQuestionCommand(surveyId, questionId);
            await _mediator.Send(command);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    /// <summary>
    /// Reorders questions in a survey
    /// </summary>
    /// <param name="surveyId">Survey identifier</param>
    /// <param name="request">Array of question IDs with new order values</param>
    /// <returns>No content on success</returns>
    [HttpPut("reorder")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ReorderQuestions(
        Guid surveyId,
        [FromBody] IEnumerable<QuestionOrderDto> request)
    {
        try
        {
            var command = new ReorderQuestionsCommand(surveyId, request);
            await _mediator.Send(command);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Survey not found" });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
