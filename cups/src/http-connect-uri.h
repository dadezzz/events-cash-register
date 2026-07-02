#ifndef HTTP_CONNECT_H
#define HTTP_CONNECT_H

#include <napi.h>

Napi::Promise httpConnectUriWrapper(const Napi::CallbackInfo& info);

#endif
