using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SurveyLite.Application.DTOs;
using SurveyLite.Application.Queries.Analytics;

namespace SurveyLite.API.Controllers;

[ApiController]
[Route("api/analytics")]
[Authorize]
public class AnalyticsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AnalyticsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Export survey analytics to CSV or JSON
    /// </summary>
    [HttpPost("export")]
    public async Task<IActionResult> ExportAnalytics(
        [FromBody] ExportAnalyticsDto dto,
        CancellationToken cancellationToken)
    {
        try
        {
            var query = new ExportAnalyticsQuery(
                dto.SurveyId,
                dto.Format,
                dto.FromDate,
                dto.ToDate,
                dto.IncludeAnswers);

            var result = await _mediator.Send(query, cancellationToken);

            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            // Return file for download
            var bytes = System.Text.Encoding.UTF8.GetBytes(result.FileContent);
            return File(bytes, result.ContentType, result.FileName);
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
