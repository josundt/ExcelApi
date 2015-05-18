using System.Collections.Generic;
using Microsoft.Data.Entity.Relational.Migrations;
using Microsoft.Data.Entity.Relational.Migrations.Builders;
using Microsoft.Data.Entity.Relational.Migrations.Operations;

namespace ExcelApiTest.Migrations
{
    public partial class SeedPersons : Migration
    {
        public override void Up(MigrationBuilder migration)
        {
            migration.Sql(@"
INSERT INTO Person (FirstName, LastName, BirthDate, Gender, YearlyIncome, IsStudent)
VALUES ('John', 'Doe', '1973-02-27', 1, 500000, 0)

INSERT INTO Person (FirstName, LastName, BirthDate, Gender, YearlyIncome, IsStudent)
VALUES ('Jane', 'Doe', '1975-07-16', 0, 430000, 0)

INSERT INTO Person (FirstName, LastName, BirthDate, Gender, YearlyIncome, IsStudent)
VALUES ('Kid', 'Doe', '2008-09-16', 1, 0, 1)
");
        }
        
        public override void Down(MigrationBuilder migration)
        {
            migration.Sql(@"
DELETE FROM Person
");
        }
    }
}
