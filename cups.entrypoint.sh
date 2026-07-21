#!/bin/sh

mkdir /var/run/dbus
dbus-daemon --system --fork
avahi-daemon --daemonize --no-chroot

cupsd
export PRINTER_NAME="Generic_IPP_Pdf_Printer"
ippeveprinter -p 8631 -d /var/spool/ippeveprinter -f application/pdf $PRINTER_NAME &
lpadmin -p $PRINTER_NAME -E -v ipp://localhost:8631/ipp/print -m everywhere

touch /var/log/cups/error_log
tail -f /var/log/cups/error_log
