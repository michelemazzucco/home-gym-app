#!/bin/bash
# PreToolUse hook: stops the agent from committing or pushing on main.
# Merging into main stays a manual step on GitHub.
input=$(cat)
cmd=$(jq -r '.tool_input.command // empty' <<<"$input")
cwd=$(jq -r '.cwd // empty' <<<"$input")

grep -qE '(^|[;&|[:space:]])git([[:space:]]+-C[[:space:]]+[^[:space:]]+)?[[:space:]]+(commit|push)\b' <<<"$cmd" || exit 0

if grep -qE 'git([[:space:]]+-C[[:space:]]+[^[:space:]]+)?[[:space:]]+push\b[^;&|]*([[:space:]]|:)(main|master)([[:space:]]|$)' <<<"$cmd"; then
  echo "Blocked: never push to main. Push a feature branch and open a PR (see the ship skill)." >&2
  exit 2
fi

branch=$(git -C "${cwd:-.}" branch --show-current 2>/dev/null)
if [[ $branch == main || $branch == master ]]; then
  echo "Blocked: you are on $branch. Create a branch from origin/main first (see the ship skill)." >&2
  exit 2
fi
exit 0
