---
name: ship
description: Put the current work on a fresh branch, commit it, push it and open a PR. Use when Michele says ship, or "commit, push and open pr", "branch and commit", "commit and push", or any mix of those steps.
---

# Ship

Do only the steps he asked for, in this order. Never merge: he merges on GitHub.

1. **Branch.** If on `main`, or he says "new branch", run `git fetch origin` and
   `git switch -c <type>/<short-slug> origin/main`, carrying the uncommitted changes. Name it after
   the change (`feat/plausible`, `fix/step-two-layout`), never after the session. On a branch whose
   PR is already merged, branch again from `origin/main`.
2. **Stage.** Run `git status --short`. Add only the files this task changed. Leave out `.upskill/`,
   `.shots/`, `.afk/` and anything he did not ask for. If a file is unclear, ask before staging it.
3. **Docs.** If the change makes a line in `CLAUDE.md` or `README.md` wrong, fix that line now, in
   the file's existing voice.
4. **Commit.** One line in this repo's style: sentence case, imperative, no `type:` prefix ("Keep
   failure toasts open until the user retries or closes them"). Split unrelated changes into
   separate commits. If he says "one commit", make one.
5. **Check.** Run `pnpm check` and `pnpm build`. If either fails, stop and report.
6. **Push.** `git push -u origin HEAD`.
7. **PR.** If a PR is already open for the branch, push only. Otherwise `gh pr create --base main`
   with the commit subject as title and a short body in his voice (`writing-style`): what changed
   and why, no headings for small changes.
8. **Report** the branch, the commits and the PR URL in two or three lines.
