---
title: "Starting New Hugo Blog"
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
```

> hugo v0.92.0+extended darwin/amd64 BuildDate=unknown

I decided to use the 'docs' directory to publish to on github; for some reason
github only offers two options

* `/ (root)`
* `/docs`

It feels cleaner to publish to an output directory.
