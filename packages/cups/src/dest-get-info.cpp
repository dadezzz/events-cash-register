#include <cups/cups.h>
#include <cups/http.h>
#include <cups/ipp.h>
#include <napi.h>

class DestGetInfoWorker : public Napi::AsyncWorker {
 private:
  const Napi::Promise::Deferred deferred;
  // Holds a reference to the connection object so that v8 doesn't garbage
  // collect it while the worker is running.
  const Napi::Reference<Napi::External<http_t>> connectionRef;
  http_t* connection;
  // Same for printer data.
  const Napi::Reference<Napi::External<cups_dest_t>> destRef;
  cups_dest_t* dest;
  cups_dinfo_t* info;

 public:
  DestGetInfoWorker(Napi::Env env,
                    Napi::External<http_t> connection,
                    Napi::External<cups_dest_t> dest)
      : Napi::AsyncWorker(env),
        deferred(env),
        connectionRef(
            Napi::Reference<Napi::External<http_t>>::New(connection, 1)),
        connection(connection.Data()),
        destRef(Napi::Reference<Napi::External<cups_dest_t>>::New(dest, 1)),
        dest(dest.Data()) {}

  Napi::Promise getDeferred() { return this->deferred.Promise(); }

  void Execute() override {
    this->info = cupsCopyDestInfo(this->connection, this->dest);
    if (cupsLastError() != 0) {
      this->SetError(
          std::format("failed to get printer info: {}", cupsLastErrorString()));
      return;
    }
  }

  void OnOK() override {
    const auto wrappedConnection = Napi::External<cups_dinfo_t>::New(
        this->Env(), this->info, [](Napi::Env, cups_dinfo_t* inner) {
          cupsFreeDestInfo(inner);
        });

    this->deferred.Resolve(wrappedConnection);
  }

  void OnError(const Napi::Error& e) override {
    this->deferred.Reject(e.Value());
  }

  ~DestGetInfoWorker() override {
    this->destRef.Unref();
    this->connectionRef.Unref();
  }
};

Napi::Promise destGetInfo(const Napi::CallbackInfo& info) {
  auto env = info.Env();
  auto connection = info[0].As<Napi::External<http_t>>();
  auto dest = info[1].As<Napi::External<cups_dest_t>>();

  auto* worker = new DestGetInfoWorker(env, connection, dest);
  worker->Queue();
  return worker->getDeferred();
}
