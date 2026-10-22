FROM docker.io/library/alpine:3.24.3@sha256:1b7232cda4ca3dc20b5d1247bdc9bfb631f2661d15d323bdd6fccc035ed1a9e7

RUN apk add --no-cache cups cups-filters avahi dbus

COPY cupsd.conf /etc/cups/cupsd.conf
COPY cups.entrypoint.sh /bin/entrypoint.sh

VOLUME /var/spool/ippeveprinter

ENTRYPOINT ["/bin/entrypoint.sh"]
