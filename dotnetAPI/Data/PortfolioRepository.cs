using API.Data;
using API.Entities;
using DotnetApi.DTOs;
using DotnetApi.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotnetApi.Data
{
    public class PortfolioRepository : IPortfolioRepository
    {
        private readonly DataContext _context;

        public PortfolioRepository(DataContext context)
        {
            _context = context;
        }

        public async Task CreatePortfolio(Portfolio portfolio)
        {
            await _context.Portfolios.AddAsync(portfolio);
        }

        public async Task<Portfolio> GetPortfolioByIdAsync(int id)
        {
            return await _context.Portfolios.FindAsync(id);
        }

        public async Task<Portfolio> GetPortfolioWithPositionsAsync(int id)
        {
            return await _context.Portfolios.Include(p => p.Positions).FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void UpdateName(Portfolio portfolio)
        {
            _context.Entry(portfolio).State = EntityState.Modified;
        }

        public void DeletePortfolio(Portfolio portfolio)
        {
            _context.Portfolios.Remove(portfolio);
        }
    }
}
