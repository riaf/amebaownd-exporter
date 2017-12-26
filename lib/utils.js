exports.contents2html = contents => {
  return contents
    .map(content => {
      switch (content.type) {
        case 'text':
          return content.value
        case 'quote':
          return `<blockquote cite="${content.url}"><p><strong>${
            content.json.title
          }</strong></p><p>${content.json.description}</p><p><cite><a href="${
            content.url
          }">${content.url}</a></cite></p></blockquote>`
        case 'image':
          return `<img src="${content.url}">`
        default:
          return ''
      }
    })
    .join('')
}

exports.extractImagesFromContents = contents =>
  contents
    .map(content => (content.type === 'image' ? content.url : false))
    .filter(url => url !== false)
