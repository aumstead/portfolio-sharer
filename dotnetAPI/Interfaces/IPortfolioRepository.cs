﻿using API.Entities;
using DotnetApi.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotnetApi.Interfaces
{
    public interface IPortfolioRepository
    {
        Task<Portfolio> GetPortfolioByIdAsync(int id);
        Task<Portfolio> GetPortfolioWithPositionsAsync(int id);
        void UpdateName(Portfolio portfolio);
        Task<bool> SaveAllAsync();
        Task CreatePortfolio(Portfolio portfolio);
        void DeletePortfolio(Portfolio portfolio);
    }
}
