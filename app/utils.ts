import TurndownService from 'turndown'

export const getMarkdown = (html: string) => {
  const turndownService = new TurndownService()
  return turndownService.turndown(html)
}
