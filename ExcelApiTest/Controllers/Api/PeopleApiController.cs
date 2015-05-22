using System.Linq;
using System.Web.Http;
using System.Web.OData;
using System.Web.OData.Query;
using ExcelApiTest.Data;
using ExcelApiTest.Filters;
using ExcelApiTest.Model;

namespace ExcelApiTest.Controllers.Api
{
    [EnableCsvFormat]
    [EnableExcelFormat(WildcardAcceptEnabled = true)]
    [RoutePrefix("api")]
    public class PeopleApiController : ApiController
    {
        private readonly DataStore _dataStore;
        
        public PeopleApiController()
        {
            _dataStore = new DataStore();
        }

        [NoCache]
        [EnableQuery]
        [Route("people")]
        [HttpGet]
        public IQueryable<Person> People()
        {
            return this._dataStore.Persons.AsQueryable();
        }
    }
}
