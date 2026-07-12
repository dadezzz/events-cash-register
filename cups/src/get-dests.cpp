#include <cups/cups.h>
#include <cups/http.h>
#include <napi.h>

#include <ranges>

class GetDestsWorker : public Napi::AsyncWorker {
 private:
  const Napi::Promise::Deferred deferred;
  // Holds a reference to the connection object so that v8 doesn't garbage
  // collect it while the worker is running.
  const Napi::Reference<Napi::External<http_t>> connectionRef;
  http_t* connection;
  cups_dest_t* dests;
  int destsLen;

 public:
  GetDestsWorker(Napi::Env env, Napi::External<http_t> connection)
      : Napi::AsyncWorker(env),
        deferred(env),
        connectionRef(
            Napi::Reference<Napi::External<http_t>>::New(connection, 1)),
        connection(connection.Data()) {}

  Napi::Promise getDeferred() { return this->deferred.Promise(); }

  void Execute() override {
    // Put dests into the temporary variables.
    this->destsLen = cupsGetDests2(this->connection, &this->dests);
    if (cupsLastError() != 0) {
      this->SetError(std::string("failed to get printers: ") +
                     cupsLastErrorString());
      return;
    }
  }

  void OnOK() override {
    auto env = this->Env();
    // Pass the size to try to avoid successive allocations.
    auto array = Napi::Array::New(env, this->destsLen);
    auto dests = std::views::counted(this->dests, this->destsLen);

    for (const auto [i, dest] : std::views::enumerate(dests)) {
      auto obj = Napi::Object::New(env);

      obj.Set("name", Napi::String::New(env, dest.name));

      // Copy the i_th entry into its own memory. Then the external object will
      // handle its memory.
      cups_dest_t* destCopy = nullptr;
      cupsCopyDest(&dest, 0, &destCopy);

      auto externalDest = Napi::External<cups_dest_t>::New(
          env, destCopy, [](Napi::Env, cups_dest_t* inner) {
            cupsFreeDests(1, inner);
          });

      // Data is used to provide a handle to the printer back to the c++ code.
      obj.Set("data", externalDest);

      array.Set(i, obj);
    }

    this->deferred.Resolve(array);
  }

  void OnError(const Napi::Error& e) override {
    this->deferred.Reject(e.Value());
  }

  ~GetDestsWorker() override {
    this->connectionRef.Unref();
    cupsFreeDests(this->destsLen, this->dests);
  }
};

Napi::Promise getDests(const Napi::CallbackInfo& info) {
  auto env = info.Env();
  auto connection = info[0].As<Napi::External<http_t>>();

  auto* worker = new GetDestsWorker(env, connection);
  worker->Queue();
  return worker->getDeferred();
}
