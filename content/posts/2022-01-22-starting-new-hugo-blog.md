---
title: "Hugo Blog"
date: 2022-01-22T22:38:35-05:00
author: Big Datum
summary: a short howto for starting Hugo on GitHub
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

NOTE: don't forget to `touch .nojekyll & git add .nojekyll` in the root
directory; this will prevent the github action from trying to run jekyll.
As described in this
[post](https://github.blog/2009-12-29-bypassing-jekyll-on-github-pages/)
it must be placed in the document root.

## build-site and serve
The instructions call for building and testing the site with the commands:

* to build

```bash
hugo -d ./docs
git add docs
```

* to start a local server on localhost:1313

```bash
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

# Finalize
There are a few other instructions (not listed here) that deal with theme-ing
and configuration.  The things that caused more time than necessary were the
new instructions on linking DNS and setting up HTTPS in GitHub.

From the GitHub `Settings->Pages` menu, in the target repository, you can
automatically enter the CNAME in a UI field which will write a file in your
repo at the location that corresponds with your site's root, e.g.:

```bash
cat docs/CNAME
>toughiculties.com
```

You'll have to make an A record with one of the IP addresses listed here:
[Managing a custom domain...](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain).

It's also important to make sure that all configured urls have 'HTTPS' i.e.
the main configuration file
[config.toml](https://github.com/nckz/nckz.github.io/blob/hugo/config.toml).

When this is all in order; you'll have the option to check the 'Enforce HTTPS'
box which will automatically requisition a certificate from
[Let's Encrypt](https://letsencrypt.org/).

This can all take a while (minutes/hours) before the automated checks embedded
in the GitHub `Settings->Pages` menu will allow you to proceed.  When all
checks are green, the site will be ready to preen.

# Additions
Since I moved my blog from a previous setup
([GitStrap](https://github.com/nckz/GitStrap)); I wanted to move the
Google Analytics tracker and Disqus comments over too.

## Google Analytics
First I copied the existing
[site verification html file](https://support.google.com/webmasters/answer/9008080?hl=en)
to the `/docs` directory; this works automatically.

Then I added my 'property id' to the
[configuration file](https://gohugo.io/templates/internal/#google-analytics).
I'm using the [Ananke](https://github.com/theNewDynamic/gohugo-theme-ananke#readme)
theme so the instructions for enabling addons can be found her in the
[Production](https://github.com/theNewDynamic/gohugo-theme-ananke#production) section.
I had to add `HUGO_ENV=production` to my build command.

The layout is automatically taken up and added on the next build. This can be
verified by viewing the 'Realtime' stats in
[Google Analytics](https://analytics.google.com).

## .gitignore
It's important to know which files are not necessary to track; there seems to
be consensus around the `resources/_gen` directory (see
[example](https://gist.github.com/muhannad0/e78f14d7bfa2a1a48320ec7194e5c516)).
