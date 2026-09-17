export const fallbackCopyText = (text: string, onDone: (message: string) => void) => {
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
    onDone(successful ? 'Workout plan copied to clipboard!' : 'Failed to copy workout plan.')
  } catch {
    onDone('Copy not supported.')
  } finally {
    document.body.removeChild(textArea)
  }
}

export const copyText = async (text: string, onDone: (message: string) => void) => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      onDone('Workout plan copied to clipboard!')
      return
    } catch {
      // fall through to the textarea fallback
    }
  }
  fallbackCopyText(text, onDone)
}
