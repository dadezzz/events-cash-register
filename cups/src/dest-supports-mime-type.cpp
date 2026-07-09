#include <cups/cups.h>
#include <napi.h>

Napi::Boolean destSupportsMimeTypeWrapper(const Napi::CallbackInfo& info) {
  const auto env = info.Env();
  const auto connectionExt = info[0].As<Napi::External<http_t>>();
  const auto destExt = info[1].As<Napi::External<cups_dest_t>>();
  const auto destInfoExt = info[2].As<Napi::External<cups_dinfo_t>>();
  const auto mimeTypeExt = info[3].As<Napi::String>();
  auto* connection = connectionExt.Data();
  auto* dest = destExt.Data();
  auto* destInfo = destInfoExt.Data();
  auto mimeType = mimeTypeExt.Utf8Value();

  auto support = cupsCheckDestSupported(connection,
                                        dest,
                                        destInfo,
                                        "document-format-supported",
                                        mimeType.c_str()) != 0;

  return Napi::Boolean::New(env, support);
}
