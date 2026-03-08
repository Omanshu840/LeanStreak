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
ORIGIN_URL="$(git remote get-url origin)"

echo "Building static site..."
npm run build

touch "$BUILD_DIR/.nojekyll"

deploy_dir="$(mktemp -d)"
cleanup() {
  rm -rf "$deploy_dir"
}
trap cleanup EXIT

rsync -a --delete "$BUILD_DIR"/ "$deploy_dir"/

(
  cd "$deploy_dir"
  git init >/dev/null
  git checkout -b "$BRANCH" >/dev/null
  git add -A

  git -c user.name="leanstreak-deploy" -c user.email="deploy@localhost" \
    commit -m "Deploy GitHub Pages ($(date -u +'%Y-%m-%d %H:%M:%S UTC'))" >/dev/null
  git remote add origin "$ORIGIN_URL"
  git push origin "HEAD:$BRANCH" --force
)

echo "Deployed to branch '$BRANCH'."
echo "If needed, set GitHub Pages source to '$BRANCH' (root) in repo settings."
