'use strict'

const xmlbuilder = require('xmlbuilder')
const { DateTime } = require('luxon')
const { contents2html } = require('./utils')

module.exports = class WxrFormatter {
  constructor() {
    const xml = xmlbuilder
      .create('rss')
      .att('xmlns:excerpt', 'http://wordpress.org/export/1.2/expert')
      .att('xmlns:content', 'http://purl.org/rss/1.0/modules/content/')
      .att('xmlns:wfw', 'http://wellformedweb.org/CommentAPI/')
      .att('xmlns:dc', 'http://purl.org/dc/elements/1.1/')
      .att('xmlns:wp', 'http://wordpress.org/export/1.2/')
      .att('version', '2.0')

    const channel = xml.ele('channel')
    channel.ele('wp:wxr_version', {}, 1.2)
    channel.ele('generator', {}, 'amebaownd-exporter')

    this.xml = xml
    this.channel = channel
  }

  addEntry(entry) {
    const post = this.channel.ele('item')
    const date = DateTime.fromISO(entry.publishedAt)

    post.ele('title', {}, entry.title)
    post.ele('link', {}, entry.publishedUrl)
    post.ele('pubDate', {}, date.toRFC2822())
    post.ele('dc:creator').cdata(entry.user.nickname)
    post.ele('guid', { isPermaLink: false }, entry.id)
    post.ele('description').cdata(entry.ogpDescription)
    post.ele('content:encoded').cdata(contents2html(entry.contents))
    post.ele('excerpt:encoded').cdata('')
    post.ele('wp:post_id', {}, entry.id)
    post.ele('wp:post_date').cdata(date.toFormat('yyyy-MM-dd HH:mm:ss'))
    post.ele('wp:comment_status', {}, 'close')
    post.ele('wp:ping_status', {}, 'close')
    post.ele('post_name').cdata(entry.title)
    post.ele('wp:post_type', {}, 'post')
    post.ele('wp:status', {}, entry.status)
    post.ele('wp:post_parent', {}, 0)
    post.ele('wp:menu_order', {}, 0)
    post.ele('wp:is_sticky', {}, 0)

    entry.blogCategories.forEach(category => {
      post
        .ele('category', {
          domain: 'category',
          nicename: category.id
        })
        .cdata(category.label)
    })
  }

  finish() {
    return this.xml.end({
      pretty: true,
      indent: '  ',
      newline: '\n'
    })
  }
}
