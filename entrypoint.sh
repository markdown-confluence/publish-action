#!/bin/sh
set -eu

case "${CONFLUENCE_ACTION_COMMAND:-publish}" in
  publish)
    set --
    if [ -n "${CONFLUENCE_ACTION_REPORT_PATH:-}" ]; then
      set -- --report "$CONFLUENCE_ACTION_REPORT_PATH"
    fi
    ;;
  validate|plan)
    set -- "$CONFLUENCE_ACTION_COMMAND"
    if [ -n "${CONFLUENCE_ACTION_REPORT_PATH:-}" ]; then
      set -- "$@" --output "$CONFLUENCE_ACTION_REPORT_PATH"
    fi
    ;;
  *)
    printf '%s\n' 'command must be publish, validate or plan' >&2
    exit 2
    ;;
esac
exec node /app/index.js "$@"
