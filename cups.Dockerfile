FROM docker.io/library/alpine:3.24.2@sha256:31b6477333eb8257db9e5d7c3a7264fd0467928756f0bbcc27d35bea5d28cdbd

RUN apk add --no-cache cups cups-filters avahi dbus

COPY cupsd.conf /etc/cups/cupsd.conf
COPY cups.entrypoint.sh /bin/entrypoint.sh

VOLUME /var/spool/ippeveprinter

ENTRYPOINT ["/bin/entrypoint.sh"]
