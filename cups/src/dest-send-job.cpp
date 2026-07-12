#include <cups/cups.h>
#include <napi.h>

class SendJobWorker : public Napi::AsyncWorker {
 private:
  const Napi::Promise::Deferred deferred;

  const Napi::Reference<Napi::External<http_t>> connectionRef;
  const Napi::Reference<Napi::External<cups_dest_t>> destRef;
  const Napi::Reference<Napi::External<cups_dinfo_t>> dinfoRef;
  const Napi::Reference<Napi::Uint8Array> docRef;

  http_t* connection;
  cups_dest_t* dest;
  cups_dinfo_t* dinfo;

  std::string title;
  int cupsOptionsLen = 0;
  cups_option_t* cupsOptions = nullptr;
  std::string docMimeType;
  std::size_t docSize;
  const char* docBuffer;

  int jobId;

 public:
  SendJobWorker(Napi::Env env,
                Napi::External<http_t> connection,
                Napi::External<cups_dest_t> dest,
                Napi::External<cups_dinfo_t> dinfo,
                Napi::String title,
                Napi::Array options,
                Napi::String docMimeType,
                Napi::Uint8Array doc)
      : Napi::AsyncWorker(env),
        deferred(env),

        connectionRef(
            Napi::Reference<Napi::External<http_t>>::New(connection, 1)),
        destRef(Napi::Reference<Napi::External<cups_dest_t>>::New(dest, 1)),
        dinfoRef(Napi::Reference<Napi::External<cups_dinfo_t>>::New(dinfo, 1)),
        docRef(Napi::Reference<Napi::Uint8Array>::New(doc, 1)),

        connection(connection.Data()),
        dest(dest.Data()),
        dinfo(dinfo.Data()),

        title(title.Utf8Value()),
        docMimeType(docMimeType.Utf8Value()),
        docSize(doc.ByteLength()),
        docBuffer(reinterpret_cast<const char*>(doc.Data())) {
    for (auto [i, option] : options) {
      auto optionObj = option.AsValue().As<Napi::Object>();
      auto name = optionObj.Get("name").As<Napi::String>().Utf8Value();

      if (name == "copies") {
        auto value = optionObj.Get("value").As<Napi::Number>().Int32Value();
        this->cupsOptionsLen = cupsAddIntegerOption(
            CUPS_COPIES, value, this->cupsOptionsLen, &this->cupsOptions);
      } else if (name == "finishings") {
        auto value = optionObj.Get("value").As<Napi::String>().Utf8Value();
        this->cupsOptionsLen = cupsAddOption(CUPS_FINISHINGS,
                                             value.c_str(),
                                             this->cupsOptionsLen,
                                             &this->cupsOptions);
      } else if (name == "printColorMode") {
        auto value = optionObj.Get("value").As<Napi::String>().Utf8Value();
        this->cupsOptionsLen = cupsAddOption(CUPS_PRINT_COLOR_MODE,
                                             value.c_str(),
                                             this->cupsOptionsLen,
                                             &this->cupsOptions);
      } else if (name == "media") {
        auto value = optionObj.Get("value").As<Napi::String>().Utf8Value();
        this->cupsOptionsLen = cupsAddOption(CUPS_MEDIA,
                                             value.c_str(),
                                             this->cupsOptionsLen,
                                             &this->cupsOptions);
      }
    }
  }

  Napi::Promise getDeferred() { return this->deferred.Promise(); }

  void Execute() override {
    cupsCreateDestJob(this->connection,
                      this->dest,
                      this->dinfo,
                      &this->jobId,
                      this->title.c_str(),
                      this->cupsOptionsLen,
                      this->cupsOptions);
    if (cupsLastError() != 0) {
      this->SetError(
          std::format("job creation failed: {}", cupsLastErrorString()));
      return;
    }

    cupsStartDestDocument(this->connection,
                          this->dest,
                          this->dinfo,
                          this->jobId,
                          this->title.c_str(),
                          this->docMimeType.c_str(),
                          0,
                          nullptr,
                          1);
    if (cupsLastError() != 0) {
      this->SetError(
          std::format("job start document failed: {}", cupsLastErrorString()));
      return;
    }

    cupsWriteRequestData(this->connection, this->docBuffer, this->docSize);
    if (cupsLastError() != 0) {
      this->SetError(std::format("job send document data failed: {}",
                                 cupsLastErrorString()));
      return;
    }

    cupsFinishDestDocument(this->connection, this->dest, this->dinfo);
    if (cupsLastError() != 0) {
      this->SetError(
          std::format("job finish document failed: {}", cupsLastErrorString()));
      return;
    }
  }

  void OnOK() override {
    this->deferred.Resolve(Napi::Number::New(this->Env(), this->jobId));
  }

  void OnError(const Napi::Error& e) override {
    this->deferred.Reject(e.Value());
  }

  ~SendJobWorker() override {
    cupsFreeOptions(this->cupsOptionsLen, this->cupsOptions);
    this->docRef.Unref();
    this->dinfoRef.Unref();
    this->destRef.Unref();
    this->connectionRef.Unref();
  }
};

Napi::Promise destSendJob(const Napi::CallbackInfo& info) {
  const auto env = info.Env();
  const auto connectionExt = info[0].As<Napi::External<http_t>>();
  const auto destExt = info[1].As<Napi::External<cups_dest_t>>();
  const auto dinfoExt = info[2].As<Napi::External<cups_dinfo_t>>();
  const auto titleExt = info[3].As<Napi::String>();
  const auto optionsExt = info[4].As<Napi::Array>();
  const auto mimeTypeExt = info[5].As<Napi::String>();
  const auto documentExt = info[6].As<Napi::Uint8Array>();

  auto* worker = new SendJobWorker(env,
                                   connectionExt,
                                   destExt,
                                   dinfoExt,
                                   titleExt,
                                   optionsExt,
                                   mimeTypeExt,
                                   documentExt);

  worker->Queue();
  return worker->getDeferred();
}
