﻿using Microsoft.EntityFrameworkCore;
using PoopBuddy.Data.Database.Entities;
using PoopBuddy.Shared;

namespace PoopBuddy.Data.Database.Context
{
    public class PoopingContext : DbContext
    {
        private readonly IWebApiConfiguration configuration;

        public PoopingContext(IWebApiConfiguration configuration, DbContextOptions<PoopingContext> options) : base(options)
        {
            this.configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if(optionsBuilder.IsConfigured == false) // checking if db was not already configured for InMemory tests
                optionsBuilder.UseSqlServer(configuration.ConnectionString);
        }

        public DbSet<PoopingEntity> Poopings { get;set; }
        public DbSet<SubscriberEntity> Subscribers { get;set; }
    }
}
