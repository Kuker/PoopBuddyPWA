﻿using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using PoopBuddy.Data.Database.Context;
using PoopBuddy.Shared;

namespace PoopBuddy.Test.PoopingDbTests
{
    [TestClass]
    public abstract class InMemoryDbTestBase
    {
        protected PoopingContext Context;


        // TestContext musi być public ponieważ jest automatycznie uzupełniane przez MsTest
        // ReSharper disable once MemberCanBePrivate.Global
        public TestContext TestContext { get; set; }

        [TestInitialize]
        public virtual void BeforeEachTest()
        {
            var options = new DbContextOptionsBuilder<PoopingContext>()
                .UseInMemoryDatabase(TestContext.TestName)
                .Options;

            var configuration = new Mock<IWebApiConfiguration>();
            Context = new PoopingContext(configuration.Object, options);
        }

        [TestCleanup]
        public virtual void AfterEachTest()
        {
            Context.Dispose();
            Context = null;
        }
    }
}