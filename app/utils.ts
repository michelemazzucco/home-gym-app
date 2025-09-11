import TurndownService from 'turndown'

export const getMarkdown = (html: string) => {
  const turndownService = new TurndownService()
  return turndownService.turndown(html)
}

export const fallbackCopyText = (text: string, showToast: (message: string) => void) => {
  const textArea = document.createElement('textarea')
  textArea.value = text

  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
  textArea.style.opacity = '0'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    textArea.setSelectionRange(0, 99999)
    const successful = document.execCommand('copy')
    if (successful) {
      showToast('Workout plan copied to clipboard!')
    } else {
      showToast('Failed to copy workout plan.')
    }
  } catch (err) {
    showToast('Copy not supported.')
    console.log(err)
  } finally {
    document.body.removeChild(textArea)
  }
}
