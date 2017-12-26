#!/usr/bin/env node

const AmebaowndExporter = require('../')

require('yargs')
  .command(
    'export [siteId]',
    'Export to Hugo',
    yargs => {
      yargs.positional('siteId', {
        describe: 'Amebaownd siteId'
      })
    },
    args => {
      action(args)
    }
  )
  .option('hugodir', {
    alias: 'd',
    default: ''
  })
  .option('verbose', {
    alias: 'v',
    default: false
  }).argv

async function action({ siteId, hugodir, verbose }) {
  if (verbose) {
    process.stderr.write(`Amebaownd Exporter: ${siteId}`)
  }

  const exporter = new AmebaowndExporter({
    siteId: siteId,
    format: 'hugo',
    formatterOptions: {
      hugoDir: hugodir
    }
  })

  await exporter.crawl()
}
