#include <cups/cups.h>
#include <cups/ipp.h>
#include <napi.h>

#include <ranges>

Napi::Object parseEnumAttribute(const Napi::Env& env,
                                http_t* connection,
                                cups_dest_t* dest,
                                cups_dinfo_t* dinfo,
                                const char* name) {
  auto* supportedAttr = cupsFindDestSupported(connection, dest, dinfo, name);
  auto* defaultAttr = cupsFindDestDefault(connection, dest, dinfo, name);

  auto resultObj = Napi::Object::New(env);
  resultObj.Set("type", Napi::String::New(env, "string"));
  auto constraintsObj = Napi::Object::New(env);
  auto supportedArray = Napi::Array::New(env);

  if (supportedAttr != nullptr) {
    for (auto i : std::views::iota(0, ippGetCount(supportedAttr))) {
      const char* v = ippEnumString(name, ippGetInteger(supportedAttr, i));
      supportedArray.Set(i, Napi::String::New(env, v));
    }
  }

  constraintsObj.Set("entries", supportedArray);
  resultObj.Set("constraints", constraintsObj);

  const char* defaultStr =
      defaultAttr != nullptr
          ? ippEnumString(name, ippGetInteger(defaultAttr, 0))
          : nullptr;

  resultObj.Set(
      "default",
      Napi::String::New(env, defaultStr != nullptr ? defaultStr : ""));

  return resultObj;
}

Napi::Object parseStringAttribute(const Napi::Env& env,
                                  http_t* connection,
                                  cups_dest_t* dest,
                                  cups_dinfo_t* dinfo,
                                  const char* name) {
  auto* supportedAttr = cupsFindDestSupported(connection, dest, dinfo, name);
  auto* defaultAttr = cupsFindDestDefault(connection, dest, dinfo, name);

  auto resultObj = Napi::Object::New(env);
  resultObj.Set("type", Napi::String::New(env, "string"));
  auto constraintsObj = Napi::Object::New(env);
  auto supportedArray = Napi::Array::New(env);

  if (supportedAttr != nullptr) {
    for (auto i : std::views::iota(0, ippGetCount(supportedAttr))) {
      const char* e = ippGetString(supportedAttr, i, nullptr);
      supportedArray.Set(i, Napi::String::New(env, e != nullptr ? e : ""));
    }
  }

  constraintsObj.Set("entries", supportedArray);
  resultObj.Set("constraints", constraintsObj);

  const char* defaultStr =
      defaultAttr != nullptr ? ippGetString(defaultAttr, 0, nullptr) : nullptr;

  resultObj.Set(
      "default",
      Napi::String::New(env, defaultStr != nullptr ? defaultStr : ""));

  return resultObj;
}

Napi::Array destGetJobCreationAttributes(const Napi::CallbackInfo& info) {
  const auto env = info.Env();
  const auto connectionExt = info[0].As<Napi::External<http_t>>();
  const auto destExt = info[1].As<Napi::External<cups_dest_t>>();
  const auto dinfoExt = info[2].As<Napi::External<cups_dinfo_t>>();
  auto* connection = connectionExt.Data();
  auto* dest = destExt.Data();
  auto* dinfo = dinfoExt.Data();

  auto i = 0;
  auto array = Napi::Array::New(env);

  auto finishingsObj =
      parseEnumAttribute(env, connection, dest, dinfo, CUPS_FINISHINGS);
  finishingsObj.Set("name", "finishings");

  array.Set(i++, finishingsObj);

  auto printColorModeObj =
      parseStringAttribute(env, connection, dest, dinfo, CUPS_PRINT_COLOR_MODE);
  printColorModeObj.Set("name", "printColorMode");

  array.Set(i++, printColorModeObj);

  auto mediaObj =
      parseStringAttribute(env, connection, dest, dinfo, CUPS_MEDIA);
  mediaObj.Set("name", "media");

  array.Set(i++, mediaObj);

  return array;
}
