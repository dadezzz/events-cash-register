#include <cups/cups.h>
#include <cups/ipp.h>
#include <cups/language.h>
#include <napi.h>

#include <ranges>

Napi::Array destGetJobCreationAttributesWrapper(
    const Napi::CallbackInfo& info) {
  const auto env = info.Env();
  const auto connectionExt = info[0].As<Napi::External<http_t>>();
  const auto destExt = info[1].As<Napi::External<cups_dest_t>>();
  const auto destInfoExt = info[2].As<Napi::External<cups_dinfo_t>>();
  auto* connection = connectionExt.Data();
  auto* dest = destExt.Data();
  auto* destInfo = destInfoExt.Data();

  auto* jobCreationValues = cupsFindDestSupported(
      connection, dest, destInfo, "job-creation-attributes");

  auto array = Napi::Array::New(env);

  auto arrayIdx = 0;
  for (const auto i : std::views::iota(0, ippGetCount(jobCreationValues))) {
    const auto attrName =
        std::string(ippGetString(jobCreationValues, i, nullptr));

    // Skip these since we don't want the user to configure them.
    if (attrName.starts_with("job-") || attrName.starts_with("ipp-")) {
      continue;
    }

    auto obj = Napi::Object::New(env);
    obj.Set("name", Napi::String::New(env, attrName));

    auto* attrValues =
        cupsFindDestSupported(connection, dest, destInfo, attrName.c_str());

    if (attrValues == nullptr) {
      continue;
    }

    const auto attrValuesCount = ippGetCount(attrValues);
    auto values = Napi::Array::New(env, attrValuesCount);

    const auto valueTag = ippGetValueTag(attrValues);
    obj.Set("valueTag", Napi::Number::New(env, valueTag));
    obj.Set("valueTagStr", Napi::String::New(env, ippTagString(valueTag)));

    for (const auto j : std::views::iota(0, attrValuesCount)) {
      switch (valueTag) {
        case IPP_TAG_INTEGER:
          values.Set(j, Napi::Number::New(env, ippGetInteger(attrValues, j)));
          break;
        case IPP_TAG_BOOLEAN:
          values.Set(
              j, Napi::Boolean::New(env, ippGetBoolean(attrValues, j) != 0));
          break;
        case IPP_TAG_ENUM: {
          const auto* str =
              ippEnumString(attrName.c_str(), ippGetInteger(attrValues, j));
          values.Set(j, Napi::String::New(env, str));
          break;
        }
        case IPP_TAG_RESOLUTION: {
          int xres;
          int yres;
          ipp_res_t units;
          xres = ippGetResolution(attrValues, j, &yres, &units);
          auto resObj = Napi::Object::New(env);
          resObj.Set("xres", Napi::Number::New(env, xres));
          resObj.Set("yres", Napi::Number::New(env, yres));
          resObj.Set("units", Napi::Number::New(env, units));
          values.Set(j, resObj);
          break;
        }
        case IPP_TAG_RANGE: {
          int upper;
          int lower;
          lower = ippGetRange(attrValues, j, &upper);
          auto rangeObj = Napi::Object::New(env);
          rangeObj.Set("upper", Napi::Number::New(env, upper));
          rangeObj.Set("lower", Napi::Number::New(env, lower));
          values.Set(j, rangeObj);
          break;
        }
        case IPP_TAG_STRING:
        case IPP_TAG_DATE:
        case IPP_TAG_TEXTLANG:
        case IPP_TAG_NAMELANG:
        case IPP_TAG_TEXT:
        case IPP_TAG_NAME:
        case IPP_TAG_KEYWORD:
        case IPP_TAG_URI:
        case IPP_TAG_URISCHEME:
        case IPP_TAG_CHARSET:
        case IPP_TAG_LANGUAGE:
        case IPP_TAG_MIMETYPE:
        case IPP_TAG_MEMBERNAME: {
          values.Set(
              j, Napi::String::New(env, ippGetString(attrValues, j, nullptr)));
          break;
        }
        default:
          break;
      }
    }

    obj.Set("values", values);

    array.Set(arrayIdx, obj);
    arrayIdx += 1;
  }

  return array;
}
