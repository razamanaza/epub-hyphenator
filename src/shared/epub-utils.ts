import AdmZip from 'adm-zip'
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
