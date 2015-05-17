using System.Configuration;
using ExcelApiTest.Model;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Metadata.Builders;

namespace ExcelApiTest.Data
{
    public class DataStore : DbContext
    {
        public DbSet<Person> Persons { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            optionsBuilder.UseSqlServer(ConfigurationManager.ConnectionStrings["ExcelApiTestDb"].ConnectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Person>().Configure();
        }
    }

    internal static class EntityTypeBuilderExtensions
    {
        public static void Configure(this EntityTypeBuilder<Person> person)
        {
            person.ForSqlServer().Table("Person");

            person.Key(p => p.Id);

            person.Property(p => p.FirstName)
                .MaxLength(50)
                .Required();

            person.Property(p => p.LastName)
                .MaxLength(50)
                .Required();
            person.Property(p => p.BirthDate)
                .Required();

            
        }
    }
    
}

// OLD EF6 implementation:

/*
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration;
using ExcelApiTest.Model;

namespace ExcelApiTest.Data
{
    public class DataStore : DbContext
    {
        public DataStore()
            : base("ExcelApiTestDb")
        {
            Database.SetInitializer(new PersonDbInitializer());
        }

        public DbSet<Person> Persons { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Configurations.Add(new PersonFluentConfiguration());
        }
    }

    public class PersonFluentConfiguration : EntityTypeConfiguration<Person>
    {
        public PersonFluentConfiguration()
        {
            ToTable("Person");
            HasKey(p => p.Id);
            Property(p => p.FirstName).HasMaxLength(50).IsRequired();
            Property(p => p.LastName).HasMaxLength(50).IsRequired();
            Property(p => p.BirthDate).IsRequired();
        }
    }

    public class PersonDbInitializer : CreateDatabaseIfNotExists<DataStore>
    {
        protected override void Seed(DataStore context)
        {
            IList<Person> persons = new List<Person>
            {
                new Person
                {
                    FirstName = "John", 
                    LastName = "Doe", 
                    BirthDate = new DateTimeOffset(1973, 2, 4, 0, 0, 0, TimeSpan.FromTicks(0)),
                    Gender = Gender.Male,
                    IsStudent = false,
                    YearlyIncome = 100000M
                },
                new Person
                {
                    FirstName = "Lisa", 
                    LastName = "Doe", 
                    BirthDate = new DateTimeOffset(1976, 11, 27, 0, 0, 0, TimeSpan.FromTicks(0)),
                    Gender = Gender.Female,
                    IsStudent = false,
                    YearlyIncome = 80000M
                },
                new Person
                {
                    FirstName = "Kid", 
                    LastName = "Doe", 
                    BirthDate = new DateTimeOffset(2005, 6, 16, 0, 0, 0, TimeSpan.FromTicks(0)),
                    Gender = Gender.Male,
                    IsStudent = true,
                    YearlyIncome = 0
                }
            };


            foreach (Person person in persons)
                context.Persons.Add(person);

            base.Seed(context);
        }
    }

}
*/