#!/usr/bin/env node

const AmebaowndExporter = require('../')

require('yargs')
  .command(
    'export [siteId]',
    'Export to Wordpress XML',
    yargs => {
      yargs.positional('siteId', {
        describe: 'Amebaownd siteId'
      })
    },
    args => {
      action(args)
    }
  )
  .option('verbose', {
    alias: 'v',
    default: false
  }).argv

async function action({ siteId, verbose }) {
  if (verbose) {
    process.stderr.write(`Amebaownd Exporter: ${siteId}`)
  }

  const exporter = new AmebaowndExporter({
    siteId: siteId,
    format: 'wxr'
  })

  process.stdout.write(await exporter.crawl())
}
