using AutoMapper;
using CORE.Models;
using SmartRecycling.Dto;

namespace SmartRecycling.Helper
{
    public class MappingProfiles: Profile
    {
        public MappingProfiles()
        {
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
            CreateMap<Operation, OperationDto>();
            CreateMap<OperationDto, Operation>();
            CreateMap<CollectionPoint, CollectionPointDto>();
            CreateMap<CollectionPointDto, CollectionPoint>();
            CreateMap<CollectionPoint, CollectionPointPatchDto>();
            CreateMap<CollectionPointPatchDto, CollectionPoint>();
            CreateMap<User, UserPatchDto>();
            CreateMap<UserPatchDto, User>();
        }
    }
}
