FROM docker.io/library/alpine:3.24.1

RUN apk add --no-cache cups cups-filters avahi dbus

COPY cupsd.conf /etc/cups/cupsd.conf
COPY cups.entrypoint.sh /bin/entrypoint.sh

VOLUME /var/spool/ippeveprinter

ENTRYPOINT ["/bin/entrypoint.sh"]
