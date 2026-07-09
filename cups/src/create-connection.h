#ifndef CREATE_CONNECTION_H
#define CREATE_CONNECTION_H

#include <napi.h>

Napi::Promise createConnectionWrapper(const Napi::CallbackInfo& info);

#endif
