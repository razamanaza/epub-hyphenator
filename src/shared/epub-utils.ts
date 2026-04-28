import AdmZip from 'adm-zip'
import * as cheerio from 'cheerio'
import postcss from 'postcss'
import type { SupportedLanguage } from './constants'

export function detectEpubLanguage(epubBuffer: Buffer): SupportedLanguage {
  const zip = new AdmZip(epubBuffer)

  const containerEntry = zip.getEntry('META-INF/container.xml')
  if (!containerEntry) return 'en'

  const containerXml = containerEntry.getData().toString('utf8')
  const opfPathMatch = containerXml.match(/full-path="([^"]+\.opf)"/)
  if (!opfPathMatch) return 'en'

  const opfEntry = zip.getEntry(opfPathMatch[1])
  if (!opfEntry) return 'en'

  const opfXml = opfEntry.getData().toString('utf8')
  const langMatch = opfXml.match(/<dc:language[^>]*>([^<]+)<\/dc:language>/i)
  if (!langMatch) return 'en'

  const lang = langMatch[1].trim().toLowerCase().split('-')[0]
  return lang === 'ru' ? 'ru' : 'en'
}

export function stripTextAlignment(epubBuffer: Buffer): Buffer {
  const zip = new AdmZip(epubBuffer)

  for (const entry of zip.getEntries()) {
    const name = entry.entryName.toLowerCase()

    if (name.endsWith('.css')) {
      const css = entry.getData().toString('utf8')
      const root = postcss.parse(css)
      root.walkDecls('text-align', (decl) => { decl.remove() })
      zip.updateFile(entry.entryName, Buffer.from(root.toResult().css, 'utf8'))
    } else if (name.endsWith('.html') || name.endsWith('.xhtml') || name.endsWith('.htm')) {
      const html = entry.getData().toString('utf8')
      const $ = cheerio.load(html, { xmlMode: name.endsWith('.xhtml') })

      $('[style]').each((_, el) => {
        const style = $(el).attr('style') ?? ''
        const cleaned = style
          .split(';')
          .filter((decl) => !/^\s*text-align\s*:/i.test(decl))
          .join(';')
          .replace(/;+$/, '')
        if (cleaned.trim()) {
          $(el).attr('style', cleaned)
        } else {
          $(el).removeAttr('style')
        }
      })

      $('[align]').removeAttr('align')

      zip.updateFile(entry.entryName, Buffer.from($.xml(), 'utf8'))
    }
  }

  return zip.toBuffer()
}
