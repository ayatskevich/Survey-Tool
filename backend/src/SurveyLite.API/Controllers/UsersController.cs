using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SurveyLite.Application.Commands.Users;
using SurveyLite.Application.DTOs;
using SurveyLite.Application.Queries.Users;

namespace SurveyLite.API.Controllers;

/// <summary>
/// User settings and profile management controller
/// </summary>
[Authorize]
[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get current user profile
    /// </summary>
    [HttpGet("profile")]
    [ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetProfile(CancellationToken cancellationToken = default)
    {
        try
        {
            var query = new GetUserProfileQuery();
            var result = await _mediator.Send(query, cancellationToken);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Update user profile (first name, last name, email)
    /// </summary>
    [HttpPut("profile")]
    [ProducesResponseType(typeof(ProfileUpdateResultDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateProfile(
        [FromBody] UpdateProfileDto dto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var command = new UpdateProfileCommand(dto.FirstName, dto.LastName, dto.Email);
            var result = await _mediator.Send(command, cancellationToken);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Change user password
    /// </summary>
    [HttpPost("change-password")]
    [ProducesResponseType(typeof(PasswordChangeResultDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ChangePassword(
        [FromBody] ChangePasswordDto dto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var command = new ChangePasswordCommand(
                dto.CurrentPassword,
                dto.NewPassword,
                dto.ConfirmPassword
            );
            var result = await _mediator.Send(command, cancellationToken);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Get user's active sessions
    /// </summary>
    [HttpGet("sessions")]
    [ProducesResponseType(typeof(List<UserSessionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSessions(CancellationToken cancellationToken = default)
    {
        try
        {
            var query = new GetUserSessionsQuery();
            var result = await _mediator.Send(query, cancellationToken);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Delete user account (requires password confirmation)
    /// </summary>
    [HttpDelete("account")]
    [ProducesResponseType(typeof(AccountDeletionResultDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteAccount(
        [FromBody] DeleteAccountDto dto,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var command = new DeleteAccountCommand(dto.ConfirmPassword);
            var result = await _mediator.Send(command, cancellationToken);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}

/// <summary>
/// Input DTO for account deletion
/// </summary>
public record DeleteAccountDto(
    string ConfirmPassword
);
