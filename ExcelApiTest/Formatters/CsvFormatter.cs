using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Reflection;
using System.Resources;
using System.Security.AccessControl;
using System.Text;

namespace ExcelApiTest.Formatters
{
    public class CsvFormatter : BufferedMediaTypeFormatter
    {
        public CsvFormatter()
        {
            SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/csv"));

            SupportedEncodings.Add(new UTF8Encoding(encoderShouldEmitUTF8Identifier: false));
            SupportedEncodings.Add(Encoding.GetEncoding("iso-8859-1"));
        }

        public override bool CanReadType(Type type)
        {
            return false;
        }

        public override bool CanWriteType(Type type)
        {
            var canWrite = type.ImplementsGenericInterface(typeof(IEnumerable<>));
            return canWrite;
        }

        public override void WriteToStream(Type type, object value, Stream writeStream, HttpContent content)
        {
            Encoding effectiveEncoding = SelectCharacterEncoding(content.Headers); 

            using (var writer = new StreamWriter(writeStream, effectiveEncoding))
            {
                var enumerable = value as IEnumerable<object>;
                var entities = enumerable != null ? enumerable.ToList() : null;
                var entityType = type.GetFirstGenericTypeParameter(typeof(IEnumerable<>));

                writer.WriteLine(
                    string.Join(
                        ";", 
                        entityType.GetPropertyLabels()));

                if (entities != null)
                {
                    foreach (var entity in entities)
                    {
                        writer.WriteLine(
                            string.Join(
                                ";", 
                                entity.GetPropertiesAsStrings(
                                    null, 
                                    GetUserTimeZoneInfo(), 
                                    CsvEscape)));
                    }
                }

                // TODO: Handle Single item queries as well?
                //else
                //{
                //    var singleItem = value as object;
                //    if (singleItem == null)
                //    {
                //        throw new InvalidOperationException("Cannot serialize type");
                //    }
                //    WriteItem(singleItem.GetType(), singleItem, writer);
                //}
            }
        }

        private TimeZoneInfo GetUserTimeZoneInfo()
        {

            // TODO: Get user time zone either from f.ex.
            // a) User profile settings 
            // b) Client Device (add request cookie/request custom header with the device timezone or timezoneoffset).
            return TimeZoneInfo.FindSystemTimeZoneById("Romance Standard Time");
        }

        static readonly char[] SpecialChars = { ';', '\n', '\r', '"' };

        private string CsvEscape(string str)
        {
            string escaped;

            if (str == null)
            {
                escaped = "";
            }
            else if (str.IndexOfAny(SpecialChars) != -1)
            {
                // Delimit the entire field with quotes and replace embedded quotes with "".
                escaped = string.Format("\"{0}\"", str.Replace("\"", "\"\""));
            }
            else
            {
                escaped = str;
            }

            return escaped;
        }

    }

}
