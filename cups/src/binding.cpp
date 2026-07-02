// Libcups v2 docs:
// https://www.cups.org/doc/cupspm.html
// Libcups v3 docs (it's similar and they have dark mode):
// https://openprinting.github.io/cups/libcups/cupspm.html
// node-addon-api docs:
// https://github.com/nodejs/node-addon-api/tree/main/doc

#include <napi.h>

#include "cups-get-dests.h"
#include "http-connect-uri.h"

Napi::Object init(Napi::Env env, Napi::Object exports) {
  exports.Set("httpConnectUri",
              Napi::Function::New(env, httpConnectUriWrapper));
  exports.Set("cupsGetDests", Napi::Function::New(env, cupsGetDestsWrapper));

  return exports;
}

NODE_API_MODULE(cups, init)
