using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SurveyLite.Application.Commands.Users;
using SurveyLite.Application.DTOs;
using SurveyLite.Application.Queries.Users;

namespace SurveyLite.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize]
public class AdminController : ControllerBase
{
    private readonly IMediator _mediator;

    public AdminController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get list of users with optional filters and pagination
    /// </summary>
    [HttpPost("users/search")]
    public async Task<ActionResult<UserPageDto>> GetUsers(
        [FromBody] UserFiltersDto filters,
        CancellationToken cancellationToken)
    {
        try
        {
            var query = new GetUsersQuery(filters);
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
    /// Update user role
    /// </summary>
    [HttpPut("users/{userId}/role")]
    public async Task<ActionResult<RoleUpdateResultDto>> UpdateUserRole(
        string userId,
        [FromBody] UpdateUserRoleDto dto,
        CancellationToken cancellationToken)
    {
        try
        {
            var command = new UpdateUserRoleCommand(userId, dto.Role);
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
    /// Suspend or unsuspend a user
    /// </summary>
    [HttpPut("users/{userId}/suspend")]
    public async Task<ActionResult<SuspensionResultDto>> SuspendUser(
        string userId,
        [FromBody] SuspendUserDto dto,
        CancellationToken cancellationToken)
    {
        try
        {
            var command = new SuspendUserCommand(userId, dto.Suspend, dto.Reason);
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
