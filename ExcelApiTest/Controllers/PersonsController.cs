using System.Linq;
using System.Web.Http;
using System.Web.OData;
using System.Web.OData.Query;
using ExcelApiTest.Data;
using ExcelApiTest.Filters;
using ExcelApiTest.Model;

namespace ExcelApiTest.Controllers
{
    [EnableCsvFormat]
    [EnableExcelFormat(WildcardAcceptEnabled = true)]
    public class PersonsController : ApiController
    {
        private readonly DataStore _dataStore;
        
        public PersonsController()
        {
            _dataStore = new DataStore();
        }

        [EnableQuery(AllowedFunctions = AllowedFunctions.AllStringFunctions)]
        [HttpGet]
        [Route("persons")]
        [NoCache]
        public IQueryable<Person> Persons()
        {
            return _dataStore.Persons.AsQueryable();
        }
    }
}
