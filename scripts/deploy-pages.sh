#!/usr/bin/env bash
set -euo pipefail

BRANCH="${1:-gh-pages}"
BUILD_DIR="out"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: deploy must be run inside a git repository."
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "Error: git remote 'origin' is not configured."
  exit 1
fi

echo "Building static site..."
npm run build

touch "$BUILD_DIR/.nojekyll"

worktree_dir="$(mktemp -d)"
cleanup() {
  git worktree remove "$worktree_dir" --force >/dev/null 2>&1 || true
  rm -rf "$worktree_dir"
}
trap cleanup EXIT

if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git worktree add --detach "$worktree_dir" "$BRANCH" >/dev/null
else
  git worktree add --detach "$worktree_dir" >/dev/null
  (
    cd "$worktree_dir"
    git checkout --orphan "$BRANCH" >/dev/null
    git rm -rf . >/dev/null 2>&1 || true
  )
fi

rsync -a --delete "$BUILD_DIR"/ "$worktree_dir"/

(
  cd "$worktree_dir"
  git add -A

  if git diff --cached --quiet; then
    echo "No changes to deploy."
    exit 0
  fi

  git commit -m "Deploy GitHub Pages ($(date -u +'%Y-%m-%d %H:%M:%S UTC'))" >/dev/null
  git push origin "HEAD:$BRANCH" --force
)

echo "Deployed to branch '$BRANCH'."
echo "If needed, set GitHub Pages source to '$BRANCH' (root) in repo settings."
