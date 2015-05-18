using System;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Metadata;
using Microsoft.Data.Entity.Metadata.Builders;
using Microsoft.Data.Entity.Relational.Migrations.Infrastructure;
using ExcelApiTest.Data;

namespace ExcelApiTest.Migrations
{
    [ContextType(typeof(DataStore))]
    partial class SeedPersons
    {
        public override string Id
        {
            get { return "20150518151920_SeedPersons"; }
        }
        
        public override string ProductVersion
        {
            get { return "7.0.0-beta4-12943"; }
        }
        
        public override IModel Target
        {
            get
            {
                var builder = new BasicModelBuilder()
                    .Annotation("SqlServer:ValueGeneration", "Sequence");
                
                builder.Entity("ExcelApiTest.Model.Person", b =>
                    {
                        b.Property<DateTimeOffset>("BirthDate")
                            .Annotation("OriginalValueIndex", 0);
                        b.Property<string>("FirstName")
                            .Annotation("MaxLength", 50)
                            .Annotation("OriginalValueIndex", 1);
                        b.Property<int>("Gender")
                            .Annotation("OriginalValueIndex", 2);
                        b.Property<int>("Id")
                            .GenerateValueOnAdd()
                            .Annotation("OriginalValueIndex", 3)
                            .Annotation("SqlServer:ValueGeneration", "Identity");
                        b.Property<bool>("IsStudent")
                            .Annotation("OriginalValueIndex", 4);
                        b.Property<string>("LastName")
                            .Annotation("MaxLength", 50)
                            .Annotation("OriginalValueIndex", 5);
                        b.Property<decimal>("YearlyIncome")
                            .Annotation("OriginalValueIndex", 6);
                        b.Key("Id");
                        b.Annotation("SqlServer:TableName", "Person");
                    });
                
                return builder.Model;
            }
        }
    }
}
