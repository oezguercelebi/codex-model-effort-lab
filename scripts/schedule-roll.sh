#!/bin/sh
# Wait until a wall-clock time, then roll whatever configurations are still
# missing from a benchmark. run-roll.mjs skips anything already captured, so
# this only ever picks up the gaps.
#
#   scripts/schedule-roll.sh "2026-08-06 02:30:00" claude-v1.json [concurrency]
#
# Detach it so it outlives the shell that armed it:
#   nohup setsid scripts/schedule-roll.sh "..." claude-v1.json 1 \
#     >> .benchmark-work/scheduled-roll.log 2>&1 &

set -eu

TARGET_LOCAL="${1:?Usage: schedule-roll.sh \"YYYY-MM-DD HH:MM:SS\" <benchmark.json> [concurrency]}"
BENCHMARK="${2:?Missing benchmark file}"
CONCURRENCY="${3:-1}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TARGET_EPOCH="$(date -j -f "%Y-%m-%d %H:%M:%S" "$TARGET_LOCAL" +%s)"

printf '%s  armed for %s (%s), benchmark=%s concurrency=%s\n' \
  "$(date '+%Y-%m-%d %H:%M:%S %Z')" "$TARGET_LOCAL" "$TARGET_EPOCH" "$BENCHMARK" "$CONCURRENCY"

while [ "$(date +%s)" -lt "$TARGET_EPOCH" ]; do
  sleep 60
done

printf '%s  target reached\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')"

# Never start on top of a run that is still going — two benchmark runs on one
# machine would contend for CPU and distort the wall-clock figure the benchmark
# is trying to measure.
while pgrep -f "scripts/run-benchmark.mjs" > /dev/null 2>&1; do
  printf '%s  waiting for an in-flight run to finish\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')"
  sleep 60
done

printf '%s  starting roll\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')"
node scripts/run-roll.mjs --benchmark "$BENCHMARK" --concurrency "$CONCURRENCY"

printf '%s  roll finished, refreshing thumbnails and site\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')"
node scripts/build-thumbnails.mjs
node scripts/build-site.mjs

printf '%s  done\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')"
