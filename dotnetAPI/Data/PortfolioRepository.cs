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
    public class PortfolioRepository : IPortfolioRepository
    {
        private readonly DataContext _context;

        public PortfolioRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<Portfolio> GetPortfolioByIdAsync(int id)
        {
            return await _context.Portfolios.FindAsync(id);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void UpdateName(Portfolio portfolio)
        {
            _context.Entry(portfolio).State = EntityState.Modified;
        }
    }
}
