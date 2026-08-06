#!/bin/sh
# Wait until a wall-clock time, then run a command from the repository root.
#
#   scripts/schedule-at.sh "2026-08-08 10:30:00" npm run review:claude
#
# Detach it so it outlives the shell that armed it:
#   nohup scripts/schedule-at.sh "2026-08-08 10:30:00" npm run review:claude \
#     >> .benchmark-work/scheduled.log 2>&1 &

set -eu

TARGET_LOCAL="${1:?Usage: schedule-at.sh \"YYYY-MM-DD HH:MM:SS\" <command...>}"
shift
[ "$#" -gt 0 ] || { echo "Missing command to run" >&2; exit 1; }

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TARGET_EPOCH="$(date -j -f "%Y-%m-%d %H:%M:%S" "$TARGET_LOCAL" +%s)"

printf '%s  armed for %s — %s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')" "$TARGET_LOCAL" "$*"

while [ "$(date +%s)" -lt "$TARGET_EPOCH" ]; do
  sleep 300
done

printf '%s  target reached, running: %s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')" "$*"
"$@"
STATUS=$?

printf '%s  finished with status %s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')" "$STATUS"
exit "$STATUS"
