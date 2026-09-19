FROM docker.io/library/alpine:3.24.2@sha256:294b683cb724975bec92580e1e685676bd4b50bda910ddb8c51d4cabeaec77e6

RUN apk add --no-cache cups cups-filters avahi dbus

COPY cupsd.conf /etc/cups/cupsd.conf
COPY cups.entrypoint.sh /bin/entrypoint.sh

VOLUME /var/spool/ippeveprinter

ENTRYPOINT ["/bin/entrypoint.sh"]
