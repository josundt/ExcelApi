using System.Collections.Generic;
using Microsoft.Data.Entity.Relational.Migrations;
using Microsoft.Data.Entity.Relational.Migrations.Builders;
using Microsoft.Data.Entity.Relational.Migrations.Operations;

namespace ExcelApiTest.Migrations
{
    public partial class Initial : Migration
    {
        public override void Up(MigrationBuilder migration)
        {
            migration.CreateSequence(
                name: "DefaultSequence",
                type: "bigint",
                startWith: 1L,
                incrementBy: 10);
            migration.CreateTable(
                name: "Person",
                columns: table => new
                {
                    Id = table.Column(type: "int", nullable: false)
                        .Annotation("SqlServer:ValueGeneration", "Identity"),
                    FirstName = table.Column(type: "nvarchar(50)", nullable: false),
                    LastName = table.Column(type: "nvarchar(50)", nullable: false),
                    BirthDate = table.Column(type: "datetimeoffset", nullable: false),
                    YearlyIncome = table.Column(type: "decimal(18, 2)", nullable: false),
                    Gender = table.Column(type: "int", nullable: false),
                    IsStudent = table.Column(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Person", x => x.Id);
                });
        }
        
        public override void Down(MigrationBuilder migration)
        {
            migration.DropSequence("DefaultSequence");
            migration.DropTable("Person");
        }
    }
}
