﻿using DotnetApi.DTOs;
using DotnetApi.Entities;
using DotnetApi.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DotnetApi.Interfaces
{
    public interface IMessageRepository
    {
        void AddMessage(Message message);
        void DeleteMessage(Message message);
        Task<Message> GetMessage(int id);
        Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams);
        Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername);
        Task<bool> SaveAllAsync();
    }
}
