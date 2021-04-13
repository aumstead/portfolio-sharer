using API.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotnetApi.Interfaces
{
    public interface IPositionRepository
    {
        Task<Position> GetPositionByIdAsync(int id);
        void UpdatePosition(Position position);
        //Task<bool> SaveAllAsync();
        Task CreatePosition(Position position);
        void DeletePosition(Position position);
    }
}
