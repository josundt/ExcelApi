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
                var items = enumerable != null ? enumerable.ToList() : null;
                var itemType = type.GetFirstGenericTypeParameter(typeof(IEnumerable<>));
                WriteColHeaders(itemType, writer);
                if (items != null)
                {
                    foreach (var item in items)
                    {
                        WriteEntity(itemType, item, writer);
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

        private void WriteColHeaders(Type type, StreamWriter streamWriter)
        {
            PropertyInfo[] propInfos = type.GetProperties(BindingFlags.Public | BindingFlags.Instance);

            var propsAsStrings = new List<string>();

            foreach (var propInfo in propInfos.Where(propInfo => propInfo.PropertyType.IsSupportedPropertyType()))
            {
                string label = null;
                var displayAttrib = propInfo.GetFirstCustomAttribute<DisplayAttribute>();
                if (displayAttrib != null)
                {
                    try
                    {
                        if (displayAttrib.ResourceType != null)
                        {
                            var resourceManager = new ResourceManager(displayAttrib.ResourceType);
                            label = resourceManager.GetString(displayAttrib.Name);
                        }
                        else
                        {
                            label = displayAttrib.Name;
                        }
                    }
                    catch
                    {
                        // ignored
                    }
                }

                if(label == null)
                {
                    label = propInfo.Name;
                }

                propsAsStrings.Add(label);
            }

            streamWriter.WriteLine(string.Join(";", propsAsStrings));
        }

        private void WriteEntity(Type type, object entity, StreamWriter writer)
        {
            //writer.WriteLine("{0};{1};{2};{3}", Escape(person.Id),
            //    Escape(person.FirstName), Escape(person.LastName), Escape(person.BirthDate), Escape(person.IsMale));
            writer.WriteLine(FormatEntity(type, entity));
        }

        private string FormatEntity(Type type, object entity)
        {
            PropertyInfo[] propInfos = type.GetProperties(BindingFlags.Public | BindingFlags.Instance);

            var propsAsStrings = new List<string>();

            foreach (var propInfo in propInfos)
            {
                if(propInfo.PropertyType.IsSupportedPropertyType())
                {
                    string displayFormat = null;
                    var displayFormatAttrib = propInfo.GetFirstCustomAttribute<DisplayFormatAttribute>();
                    if (displayFormatAttrib != null)
                    {
                        displayFormat = displayFormatAttrib.DataFormatString;
                    }

                    var value = FormatProperty(propInfo.PropertyType, propInfo.GetValue(entity, null), displayFormat);
                    propsAsStrings.Add(value);
                }
            }

            return string.Join(";", propsAsStrings);
        }

        private string FormatProperty(Type type, object value, string format = null)
        {
            string stringValue;

            if (type == typeof (DateTime))
            {
                var formatString = format ?? "G";
                stringValue = TimeZoneInfo.ConvertTimeFromUtc(((DateTime)value).ToUniversalTime(), GetUserTimeZoneInfo()).ToString(formatString);
            }
            else if (type == typeof (DateTimeOffset))
            {
                var formatString = format ?? "G";
                stringValue = TimeZoneInfo.ConvertTimeFromUtc(((DateTimeOffset)value).ToUniversalTime().DateTime, GetUserTimeZoneInfo()).ToString(formatString);
            }
            else if (type == typeof (decimal))
            {
                var formatString = format ?? "N2";
                stringValue = ((decimal) value).ToString(formatString);
            }
            else
            {
                stringValue = value.ToString();
            }
            return CsvEscape(stringValue);
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
