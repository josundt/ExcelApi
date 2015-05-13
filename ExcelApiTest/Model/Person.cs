using System;
using System.ComponentModel.DataAnnotations;
using ExcelApiTest.Resources;

namespace ExcelApiTest.Model
{
    public class Person
    {
        [Display(ResourceType = typeof(Strings), Name = "Id")]
        public int Id { get; set; }

        [Display(ResourceType = typeof(Strings), Name = "FirstName")]
        public string FirstName { get; set; }
        
        [Display(ResourceType = typeof(Strings), Name = "LastName")]
        public string LastName { get; set; }
        
        [Display(ResourceType = typeof(Strings), Name = "BirthDate")]
        [DisplayFormat(DataFormatString = "d")]
        public DateTimeOffset BirthDate { get; set; }

        [Display(ResourceType = typeof(Strings), Name = "Gender")]
        public Gender Gender { get; set; }

        [Display(ResourceType = typeof(Strings), Name = "YearlyIncome")]
        [DisplayFormat(DataFormatString = "N2")]
        public decimal YearlyIncome { get; set; }

        [Display(ResourceType = typeof(Strings), Name = "IsStudent")]
        public bool IsStudent { get; set; }
    }
}
