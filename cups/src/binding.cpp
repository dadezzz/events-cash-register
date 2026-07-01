#include <cups/cups.h>
#include <napi.h>

Napi::String helloWorld(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, "world");
}

Napi::Object init(Napi::Env env, Napi::Object exports) {
  exports.Set("helloWorld", Napi::Function::New(env, helloWorld));
  return exports;
}

NODE_API_MODULE(addon, init)
