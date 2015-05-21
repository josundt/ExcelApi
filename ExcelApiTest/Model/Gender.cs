using System.ComponentModel.DataAnnotations;
using ExcelApiTest.Resources;

namespace ExcelApiTest.Model
{
    public enum Gender
    {
        [Display(ResourceType = typeof(Strings), Name = "Male")]
        Male = 1,

        [Display(ResourceType = typeof(Strings), Name = "Female")]
        Female = 2
    }
}
