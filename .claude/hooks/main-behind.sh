#!/bin/bash
# SessionStart hook: says so when local main is behind origin/main, so work starts from the
# merged state and not from a stale checkout.
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
perl -e "alarm 5; exec @ARGV" git fetch -q origin main 2>/dev/null || exit 0
behind=$(git rev-list --count main..origin/main 2>/dev/null) || exit 0
if [[ $behind -gt 0 ]]; then
  echo "Local main is $behind commit(s) behind origin/main. Run git pull on main before branching."
fi
exit 0
