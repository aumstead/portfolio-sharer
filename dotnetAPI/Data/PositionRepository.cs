using API.Data;
using API.Entities;
using DotnetApi.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotnetApi.Data
{
    public class PositionRepository : IPositionRepository
    {
        private readonly DataContext _context;

        public PositionRepository(DataContext context)
        {
            _context = context;
        }

        public async Task CreatePosition(Position position)
        {
            await _context.Positions.AddAsync(position);
        }

        public void DeletePosition(Position position)
        {
            _context.Positions.Remove(position);
        }

        public async Task<Position> GetPositionByIdAsync(int id)
        {
            return await _context.Positions.FindAsync(id);
        }

        public void UpdatePosition(Position position)
        {
            _context.Entry(position).State = EntityState.Modified;
        }
    }
}
