---
title: "Hugo Blog"
date: 2022-01-22T22:38:35-05:00
author: Big Datum
summary: a short howto for making this blog
---

I'm looking for the quickest way to start a blog and the easiest blogging tool
to maintain.  After looking thru a few of the "Top 10 Static Blogging Tools"
sites, I landed on [Hugo](https://gohugo.io/).  Its written in `Go` which makes
it very portable. The tools are available in [brew](https://brew.sh/) and
[port](https://www.macports.org/), two of my favorite MacOS package management
tools.

# Quickstart
I followed the [quick-start guide](https://gohugo.io/getting-started/quick-start/)
and installed the tools with brew:

```bash
brew install hugo
hugo version
> hugo v0.92.0+extended darwin/amd64 BuildDate=unknown
```

I decided to use the 'docs' directory to publish to on github; for some reason
github only offers two options

* `/ (root)`
* `/docs`

It feels cleaner to publish to an output directory.

## build-site and serve
The instructions call for building and testing the site with the commands:

```bash
# to build
hugo -d ./docs
git add docs
```

```bash
# to start a local server on localhost:1313
hugo server
```

I like to ensure that the commands are run from the correct directory (in this
case its the project-root directory).  So I rolled these commands into bash
scripts:

[build-site](https://github.com/nckz/nckz.github.io/blob/hugo/bin/build-site)
```bash
SWD="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( dirname "$SWD" )"

DOCS_DIR="docs"
TGT_DIR="${PROJECT_ROOT}/${DOCS_DIR}"

cd "${PROJECT_ROOT}"
hugo -d "${TGT_DIR}"
git add ${DOCS_DIR}
```

[serve](https://github.com/nckz/nckz.github.io/blob/hugo/bin/build-site)
```bash
SWD="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( dirname "$SWD" )"

cd "$PROJECT_ROOT"
hugo server
```

## new-post
The method for starting a new post also requires some memory; you have to
invoke the 'new' sub-command and the content org structure:

```bash
hugo new content/posts/<post-name>.md
```

[new-post](https://github.com/nckz/nckz.github.io/blob/hugo/bin/new-post)
```bash
POST_SLUG="$1"

SWD="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( dirname "$SWD" )"

NOW=$(date "+%Y-%m-%d")
TGT_POST="content/posts/$NOW-$POST_SLUG.md"

cd "${PROJECT_ROOT}"
hugo new -v "${TGT_POST}"
```

This script automates the prefix, date and file extention to reduce the barrier
for starting new posts.  It takes one argument for the base filename.  The
verbose switch is used to remind you where to find the files.

```bash
./bin/new-post hugo-blog
> Content "/Users/nick/src/nckz.github.io/content/posts/2022-01-22-hugo-blog.md" created
```
