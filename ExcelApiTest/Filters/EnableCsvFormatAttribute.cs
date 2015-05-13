using System;
using System.Linq;
using System.Web.Http.Controllers;
using ExcelApiTest.Formatters;

namespace ExcelApiTest.Filters
{
    [AttributeUsage(AttributeTargets.Class)]
    public class EnableCsvFormatAttribute : Attribute, IControllerConfiguration
    {
        public void Initialize(HttpControllerSettings controllerSettings, HttpControllerDescriptor controllerDescriptor)
        {
            if (controllerSettings == null)
            {
                throw new ArgumentNullException("controllerSettings");
            }

            if (controllerSettings.Formatters.All(f => f.GetType() != typeof(CsvFormatter)))
            {
                controllerSettings.Formatters.Add(new CsvFormatter());
            }
        }
    }
}
