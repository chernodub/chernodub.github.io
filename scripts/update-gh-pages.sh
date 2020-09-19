#!/usr/bin/env bash

# Hack to build and then host app on GitHub pages
# Basically, this script creates empty gh-pages branch, and then pushes dist/* content there so that I could use it as GitHub page

# Heavily inspired by https://www.innoq.com/en/blog/github-actions-automation/

set -eu

repo_uri="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
remote_name="origin"
main_branch="master"
target_branch="gh-pages"
build_dir="dist"

cd "$GITHUB_WORKSPACE"

git config user.name "$GITHUB_ACTOR"

# Check whether the gh-pages branch is created and remove it
if git branch -l | grep "$target_branch"; then
    git branch -D "$target_branch"
else
    echo "$target_branch isn't created"
fi

# Create empty branch
git checkout --orphan "$target_branch"
# Creating orphan, all the files are staged by default, reset this behavior
git reset


# Move .git to dist folder so not move/delete unnecessary folders
# do not judge me, but that's the easiest way :D

mv .git "./$build_dir"
cd "./$build_dir"
git add .

git commit -m "Publish GitHub Pages"
if [ $? -ne 0 ]; then
    echo "nothing to commit"
    exit 0
fi

git remote set-url "$remote_name" "$repo_uri"
git push --force "$remote_name" "$target_branch"