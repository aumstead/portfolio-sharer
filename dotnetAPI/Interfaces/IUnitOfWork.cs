using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotnetApi.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository { get; }
        IMessageRepository MessageRepository { get; }
        IFollowsRepository FollowsRepository { get; }
        IPortfolioRepository PortfolioRepository { get; }
        IPositionRepository PositionRepository { get; }
        Task<bool> Complete();
        bool HasChanges();
    }
}
