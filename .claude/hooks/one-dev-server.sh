#!/bin/bash
# PreToolUse hook: one dev server, on port 3000. If one already runs, the agent uses it.
# `next start` stays allowed, so an afk worktree can still serve its build on another port.
input=$(cat)
cmd=$(jq -r '.tool_input.command // empty' <<<"$input")

starts='(^|[;&|(][[:space:]]*)([A-Z_]+=[^[:space:]]+[[:space:]]+)*'
grep -qE "${starts}((pnpm|npm|yarn)( run)? dev|((pnpm exec|npx) )?next dev)\b" <<<"$cmd" || exit 0

port=$(grep -oE '(PORT=|-p[[:space:]]+|--port[[:space:]=]+)[0-9]+' <<<"$cmd" | grep -oE '[0-9]+$' | head -1)
if [[ -n $port && $port != 3000 ]]; then
  echo "Blocked: the dev server runs on port 3000 only. Use the one on 3000, or start it there." >&2
  exit 2
fi

if lsof -ti:3000 >/dev/null 2>&1; then
  echo "Blocked: a dev server already runs on port 3000. Use it; do not start a second one." >&2
  exit 2
fi
exit 0
