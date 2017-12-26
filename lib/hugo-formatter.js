'use strict'

const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const mkdirp = require('mkdirp')
const matter = require('gray-matter')
const { DateTime } = require('luxon')
const TurndownService = require('turndown')
const { contents2html, extractImagesFromContents } = require('./utils')

const turndownService = new TurndownService()

module.exports = class HugoFormatter {
  constructor({ hugoDir }) {
    // FIXME: directory checking
    fs.statSync(path.join(hugoDir, 'config.toml'))

    this.hugoDir = hugoDir
    this.entries = []
  }

  addEntry(entry) {
    this.entries.push(entry)
  }

  finish() {
    this.entries.forEach(entry => {
      const date = DateTime.fromISO(entry.publishedAt)
      const images = extractImagesFromContents(entry.contents)
      const staticDir = path.join(this.hugoDir, 'static/images/imported')
      const contentDir = path.join(this.hugoDir, `content/imported`)
      const contentPath = path.join(contentDir, `${entry.id}.md`)

      mkdirp.sync(staticDir)
      mkdirp.sync(contentDir)

      images.forEach(async imgUrl => {
        const destPath = path.join(staticDir, path.basename(imgUrl))

        try {
          fs.statSync(destPath)
        } catch (e) {
          const dest = fs.createWriteStream(destPath)
          const res = await fetch(imgUrl)
          res.body.pipe(dest)
        }
      })

      const contents = entry.contents.map(
        content =>
          content.type === 'image'
            ? Object.assign({}, content, {
                url: `/images/imported/${path.basename(content.url)}`
              })
            : content
      )

      const body = matter.stringify(
        turndownService.turndown(contents2html(contents)),
        {
          title: entry.title,
          date: date.toRFC2822(),
          type: 'post',
          categories: entry.blogCategories.map(category => category.label)
        }
      )

      fs.writeFileSync(contentPath, body)
    })
  }
}
