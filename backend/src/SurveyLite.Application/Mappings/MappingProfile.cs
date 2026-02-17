using AutoMapper;
using SurveyLite.Application.DTOs;
using SurveyLite.Domain.Entities;

namespace SurveyLite.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User mappings
        CreateMap<User, UserDto>();
        CreateMap<CreateUserDto, User>();
        CreateMap<UpdateProfileDto, User>();

        // Survey mappings
        CreateMap<Survey, SurveyResponseDto>()
            .ForMember(dest => dest.QuestionCount, opt => opt.MapFrom(src => src.Questions.Count))
            .ForMember(dest => dest.ResponseCount, opt => opt.MapFrom(src => src.Responses.Count))
            .ForMember(dest => dest.Questions, opt => opt.MapFrom(src => src.Questions));

        CreateMap<Survey, SurveyListDto>()
            .ForMember(dest => dest.QuestionCount, opt => opt.MapFrom(src => src.Questions.Count))
            .ForMember(dest => dest.ResponseCount, opt => opt.MapFrom(src => src.Responses.Count));
        
        CreateMap<CreateSurveyDto, Survey>();
        CreateMap<UpdateSurveyDto, Survey>();

        // Question mappings
        CreateMap<Question, QuestionDto>();
        CreateMap<CreateQuestionDto, Question>();
        CreateMap<UpdateQuestionDto, Question>();

        // Response mappings
        CreateMap<Response, ResponseDto>();
        CreateMap<Answer, AnswerDto>();
    }
}

public record ResponseDto(
    Guid Id,
    Guid SurveyId,
    string? RespondentEmail,
    DateTime SubmittedAt,
    IEnumerable<AnswerDto> Answers
);

public record AnswerDto(
    Guid Id,
    Guid QuestionId,
    string AnswerText
);
