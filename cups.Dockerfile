FROM docker.io/library/alpine:3.24.1@sha256:28bd5fe8b56d1bd048e5babf5b10710ebe0bae67db86916198a6eec434943f8b

RUN apk add --no-cache cups cups-filters avahi dbus

COPY cupsd.conf /etc/cups/cupsd.conf
COPY cups.entrypoint.sh /bin/entrypoint.sh

VOLUME /var/spool/ippeveprinter

ENTRYPOINT ["/bin/entrypoint.sh"]
