using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Commands.Surveys;

public record CloneSurveyCommand(string SurveyId, string NewTitle) : IRequest<CloneSurveyResultDto>;
