#include <cups/cups.h>
#include <cups/http.h>
#include <napi.h>

#include <ranges>
#include <vector>

class CupsGetDestsWorker : public Napi::AsyncWorker {
 private:
  const Napi::Promise::Deferred deferred;
  // Holds a reference to the connection object so that v8 doesn't garbage
  // collect it while the worker is running.
  const Napi::Reference<Napi::External<http_t>> connectionRef;
  http_t* connection;
  std::vector<cups_dest_t> dests;

 public:
  CupsGetDestsWorker(Napi::Env env, Napi::External<http_t> connection)
      : Napi::AsyncWorker(env),
        deferred(env),
        connectionRef(
            Napi::Reference<Napi::External<http_t>>::New(connection, 1)),
        connection(connection.Data()) {}

  Napi::Promise getDeferred() { return this->deferred.Promise(); }

  void Execute() override {
    cups_dest_t* dests = nullptr;
    int destsLen = 0;

    // Put dests into the temporary variables.
    destsLen = cupsGetDests2(this->connection, &dests);
    if (cupsLastError() != 0) {
      this->SetError(std::string("failed to get printers: ") +
                     cupsLastErrorString());
      return;
    }

    // Copy dests into our vector and then free them.
    this->dests = std::vector(dests, dests + destsLen);
    cupsFreeDests(destsLen, dests);
  }

  void OnOK() override {
    auto env = this->Env();
    auto array = Napi::Array::New(env, this->dests.size());

    for (const auto [i, dest] : std::views::enumerate(this->dests)) {
      auto obj = Napi::Object::New(env);

      obj.Set("name", Napi::String::New(env, dest.name));
      obj.Set("default", Napi::Boolean::New(env, dest.is_default != 0));

      // Copy the i_th entry into its own memory. Then the external object will
      // handle its memory.
      cups_dest_t* destCopy = nullptr;
      cupsCopyDest(&dest, 0, &destCopy);

      auto externalDest = Napi::External<cups_dest_t>::New(
          env, destCopy, [](Napi::Env, cups_dest_t* inner) {
            cupsFreeDests(1, inner);
          });

      obj.Set("data", externalDest);

      array.Set(i, obj);
    }

    this->connectionRef.Unref();
    this->deferred.Resolve(array);
  }

  void OnError(const Napi::Error& e) override {
    this->connectionRef.Unref();
    this->deferred.Reject(e.Value());
  }
};

Napi::Promise cupsGetDestsWrapper(const Napi::CallbackInfo& info) {
  auto env = info.Env();
  auto connection = info[0].As<Napi::External<http_t>>();

  auto* worker = new CupsGetDestsWorker(env, connection);
  worker->Queue();
  return worker->getDeferred();
}
