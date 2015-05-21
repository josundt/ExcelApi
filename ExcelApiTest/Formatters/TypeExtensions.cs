using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Resources;

namespace ExcelApiTest.Formatters
{
    public static class TypeExtensions
    {
        private const BindingFlags SupportedMemberFlags = 
            BindingFlags.Public | BindingFlags.Instance;

        private static readonly MemberTypes[] SupportedMemberTypes = {
            MemberTypes.Property, MemberTypes.Field
        };

        private static readonly List<Type> SupportedPropertyTypes = new List<Type>
        {
            typeof(string), 
            typeof(decimal), 
            typeof(int), 
            typeof(double), 
            typeof(bool), 
            typeof(DateTime), 
            typeof(DateTimeOffset)
            // Special check for Enums
        };
        
        
        public static Type GetFirstGenericTypeParameter(this Type type, Type interf)
        {
            Type result = null;

            foreach (Type i in type.GetInterfaces())
            {
                if (i.IsGenericType && i.GetGenericTypeDefinition() == interf)
                {
                    var genericArguments = i.GetGenericArguments();
                    if (genericArguments.Length >= 1)
                    {
                        result = genericArguments[0];
                    }
                }
            }

            return result;
        }

        public static bool ImplementsGenericInterface(this Type type, Type interf, Type typeparameter = null)
        {
            bool result = false;

            foreach (Type i in type.GetInterfaces())
            {
                if (i.IsGenericType && i.GetGenericTypeDefinition() == interf)
                {
                    if (typeparameter == null)
                    {
                        result = true;
                    }
                    else if (i.GetGenericArguments()[0] == typeparameter)
                    {
                        result = true;
                    }
                }

            }

            return result;
        }

        public static IEnumerable<PropertyInfo> GetExportableProperties(this Type type)
        {
            return type.GetProperties(SupportedMemberFlags)
                .Where(p => p.PropertyType.IsEnum || SupportedPropertyTypes.Any(sp => sp == p.PropertyType) );
        }
 
        public static string GetDisplayFormatAttributeValue(this MemberInfo memInfo)
        {
            string format = null;
            if (SupportedMemberTypes.Any(m => m == memInfo.MemberType))
            {
                var displayFormatAttrib = memInfo.GetFirstCustomAttribute<DisplayFormatAttribute>();
                if (displayFormatAttrib != null)
                {
                    format = displayFormatAttrib.DataFormatString;
                }
            }
            return format;
        }

        public static string FormatAsString(
            this PropertyInfo propInfo,
            object entity,
            TimeZoneInfo timeZoneInfo = null,
            Func<string, string> convertFunc = null)
        {

            string stringValue = null;

            timeZoneInfo = timeZoneInfo ?? TimeZoneInfo.Utc;
            if (convertFunc == null)
            {
                convertFunc = s => s;
            }

            var value = propInfo.GetValue(entity);

            if (propInfo.PropertyType.IsEnum)
            {
                var enumValue = propInfo.GetValue(entity, null);
                MemberInfo[] memberInfos = propInfo.PropertyType.GetMember(enumValue.ToString());
                if (memberInfos.Length > 0)
                {
                    MemberInfo memberInfo = memberInfos[0];
                    stringValue = memberInfo.GetDisplayAttributeValue();
                }
                stringValue = stringValue ?? enumValue.ToString();
            }
            else
            {
                var type = propInfo.PropertyType;

                if (type == typeof (DateTime))
                {
                    var formatString = propInfo.GetDisplayFormatAttributeValue() ?? "G";
                    stringValue =
                        TimeZoneInfo.ConvertTimeFromUtc(((DateTime) value).ToUniversalTime(), timeZoneInfo)
                            .ToString(formatString);
                }
                else if (type == typeof (DateTimeOffset))
                {
                    var formatString = propInfo.GetDisplayFormatAttributeValue() ?? "G";
                    stringValue =
                        TimeZoneInfo.ConvertTimeFromUtc(((DateTimeOffset) value).ToUniversalTime().DateTime,
                            timeZoneInfo).ToString(formatString);
                }
                else if (type == typeof (decimal))
                {
                    var formatString = propInfo.GetDisplayFormatAttributeValue() ?? "N2";
                    stringValue = ((decimal) value).ToString(formatString);
                }
                else
                {
                    stringValue = value.ToString();
                }
            }
            
            return convertFunc(stringValue);
        }

        public static IEnumerable<string> GetPropertiesAsStrings(
            this object entity,
            IEnumerable<PropertyInfo> propertyInfos,
            TimeZoneInfo timeZoneInfo = null,
            Func<string, string> fieldValueConvertFunc = null)
        {

            var propsAsStrings = new List<string>();

            foreach (var propInfo in entity.GetType().GetExportableProperties())
            {
                propsAsStrings.Add(propInfo.FormatAsString(entity, timeZoneInfo, fieldValueConvertFunc));
            }

            return propsAsStrings;
        }

        public static IEnumerable<string> GetPropertyLabels(this Type entityType)
        {
            return entityType.GetExportableProperties()
                .Select(propInfo => propInfo.GetDisplayAttributeValue() ?? propInfo.Name);

        }

        public static string GetDisplayAttributeValue(this MemberInfo memInfo)
        {
            string text = null;
            if (SupportedMemberTypes.Any(m => m == memInfo.MemberType))
            {
                var displayAttrib = memInfo.GetFirstCustomAttribute<DisplayAttribute>();
                if (displayAttrib != null)
                {
                    try
                    {
                        if (displayAttrib.ResourceType != null)
                        {
                            var resourceManager = new ResourceManager(displayAttrib.ResourceType);
                            text = resourceManager.GetString(displayAttrib.Name);
                        }
                        else
                        {
                            text = displayAttrib.Name;
                        }
                    }
                    catch
                    {
                        // ignored
                    }
                }
            }
            return text;
        }

        private static T GetFirstCustomAttribute<T>(this MemberInfo memInfo) where T : Attribute
        {
            var attributes = memInfo.GetCustomAttributes(typeof(T));
            return attributes.FirstOrDefault() as T;
        }


    }
}

