'use strict'

const fetch = require('node-fetch')

class AmebaowndPosts {
  constructor({ siteId, format = 'wxr', formatterOptions = {} }) {
    this.siteId = siteId
    this.formatter = new (require(`./lib/${format}-formatter`))(
      formatterOptions
    )
  }

  async crawl() {
    let cursor = ''

    do {
      const response = await this._fetch({ siteId: this.siteId, cursor })
      cursor = response.meta.pagination.cursors.after || ''

      response.body.forEach(entry => this.formatter.addEntry(entry))
    } while (cursor)

    return this.formatter.finish()
  }

  async _fetch({ siteId, cursor = '' }) {
    const url = `https://api.amebaowndme.com/v2/public/blogPosts?limit=100&siteId=${siteId}&cursor=${cursor}&sortType=recent`
    const res = await fetch(url)

    return await res.json()
  }
}

module.exports = AmebaowndPosts

