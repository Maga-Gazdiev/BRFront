#!/bin/sh
set -eu
: "${BACKEND_URL:?Set BACKEND_URL to the Go API base URL}"
: "${PORT:=80}"
case "$BACKEND_URL" in http://*|https://*) ;; *) echo "BACKEND_URL must start with http:// or https://" >&2; exit 1;; esac
BACKEND_URL="${BACKEND_URL%/}"
export BACKEND_URL PORT
exec /docker-entrypoint.sh nginx -g 'daemon off;'
