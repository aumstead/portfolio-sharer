using API.Entities;
using AutoMapper;
using DotnetApi.DTOs;
using DotnetApi.Entities;
using DotnetApi.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotnetApi.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, AppUserDto>()
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<Photo, PhotoDto>();
            CreateMap<Portfolio, PortfolioDto>();
            CreateMap<Position, PositionDto>();
            CreateMap<CreatePositionDto, Position>();
            CreateMap<AppUserUpdateDto, AppUser>();
            CreateMap<RegisterDto, AppUser>();
            CreateMap<Message, MessageDto>();
        }
    }
}
