// Libcups v2 docs:
// https://openprinting.github.io/cups/doc/cupspm.html
// Libcups v3 docs:
// https://openprinting.github.io/cups/libcups/cupspm.html
// node-addon-api docs:
// https://github.com/nodejs/node-addon-api/tree/main/doc

#include <napi.h>

#include "create-connection.h"
#include "dest-get-info.h"
#include "dest-get-job-creation-attributes.h"
#include "dest-supports-mime-type.h"
#include "get-dests.h"

Napi::Object init(Napi::Env env, Napi::Object exports) {
  exports.Set("createConnection",
              Napi::Function::New(env, createConnectionWrapper));
  exports.Set("getDests", Napi::Function::New(env, getDestsWrapper));
  exports.Set("destGetInfo", Napi::Function::New(env, destGetInfoWrapper));
  exports.Set("destSupportsMimeType",
              Napi::Function::New(env, destSupportsMimeTypeWrapper));
  exports.Set("destGetJobCreationAttributes",
              Napi::Function::New(env, destGetJobCreationAttributesWrapper));

  return exports;
}

NODE_API_MODULE(cups, init)
