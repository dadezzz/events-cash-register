// Libcups v2 docs:
// https://openprinting.github.io/cups/doc/cupspm.html
// Libcups v3 docs:
// https://openprinting.github.io/cups/libcups/cupspm.html
// node-addon-api docs:
// https://github.com/nodejs/node-addon-api/tree/main/doc

#include <napi.h>

#include "create-connection.h"
#include "dest-check-mime-type-support.h"
#include "dest-get-info.h"
#include "dest-get-job-creation-attributes.h"
#include "dest-send-job.h"
#include "get-dests.h"

Napi::Object init(Napi::Env env, Napi::Object exports) {
  exports.Set("createConnection", Napi::Function::New(env, createConnection));
  exports.Set("getDests", Napi::Function::New(env, getDests));
  exports.Set("destGetInfo", Napi::Function::New(env, destGetInfo));
  exports.Set("destCheckMimeTypeSupport",
              Napi::Function::New(env, destCheckMimeTypeSupport));
  exports.Set("destGetJobCreationAttributes",
              Napi::Function::New(env, destGetJobCreationAttributes));
  exports.Set("destSendJob", Napi::Function::New(env, destSendJob));

  return exports;
}

NODE_API_MODULE(cups, init)
