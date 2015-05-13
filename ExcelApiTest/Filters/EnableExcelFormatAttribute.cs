using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.Controllers;
using ExcelApiTest.Formatters;

namespace ExcelApiTest.Filters
{
    [AttributeUsage(AttributeTargets.Class)]
    public class EnableExcelFormatAttribute : Attribute, IControllerConfiguration
    {
        public void Initialize(HttpControllerSettings controllerSettings, HttpControllerDescriptor controllerDescriptor)
        {
            if (controllerSettings == null)
            {
                throw new ArgumentNullException("controllerSettings");
            }

            if (controllerSettings.Formatters.All(f => f.GetType() != typeof(ExcelFormatter)))
            {
                controllerSettings.Formatters.Add(new ExcelFormatter(this.WildcardAcceptEnabled));
            }
        }

        public bool WildcardAcceptEnabled { get; set; }
    }
}
