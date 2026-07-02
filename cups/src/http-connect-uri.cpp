#include <cups/cups.h>
#include <cups/http.h>
#include <cups/ipp.h>
#include <napi.h>
#include <sys/socket.h>

#include <array>

class HttpConnectUriWorker : public Napi::AsyncWorker {
 private:
  const Napi::Promise::Deferred deferred;
  const std::string uri;
  http_t* connection = nullptr;

 public:
  HttpConnectUriWorker(Napi::Env env, Napi::String url)
      : Napi::AsyncWorker(env), deferred(env), uri(url.Utf8Value()) {}

  Napi::Promise getDeferred() { return this->deferred.Promise(); }

  void Execute() override {
    // In libcups v2 there is no httpConnectUri function. Once v3 becomes we can
    // replace all of the parsing below with it.

    auto schemeBuf = std::array<char, HTTP_MAX_URI>();
    auto usernameBuf = std::array<char, HTTP_MAX_VALUE>();
    auto hostBuf = std::array<char, HTTP_MAX_HOST>();
    auto resourceBuf = std::array<char, HTTP_MAX_URI>();

    int port;

    const auto status = httpSeparateURI(HTTP_URI_CODING_HOSTNAME,
                                        this->uri.c_str(),
                                        schemeBuf.data(),
                                        schemeBuf.size(),
                                        usernameBuf.data(),
                                        usernameBuf.size(),
                                        hostBuf.data(),
                                        hostBuf.size(),
                                        &port,
                                        resourceBuf.data(),
                                        resourceBuf.size());

    if (status != HTTP_URI_STATUS_OK) {
      this->SetError(std::string("failed to parse uri: ") +
                     httpURIStatusString(status));
      return;
    }

    this->connection = httpConnect2(hostBuf.data(),
                                    port,
                                    nullptr,
                                    AF_UNSPEC,
                                    HTTP_ENCRYPTION_IF_REQUESTED,
                                    0,
                                    5000,
                                    nullptr);

    if (cupsLastError() != 0) {
      this->SetError(std::string("failed to connect: ") +
                     cupsLastErrorString());
      return;
    }
  }

  void OnOK() override {
    const auto wrappedConnection = Napi::External<http_t>::New(
        this->Env(), this->connection, [](Napi::Env, http_t* inner) {
          httpClose(inner);
        });

    this->deferred.Resolve(wrappedConnection);
  }

  void OnError(const Napi::Error& e) override {
    this->deferred.Reject(e.Value());
  }
};

Napi::Promise httpConnectUriWrapper(const Napi::CallbackInfo& info) {
  auto env = info.Env();
  auto url = info[0].As<Napi::String>();

  auto* worker = new HttpConnectUriWorker(env, url);
  worker->Queue();
  return worker->getDeferred();
}
