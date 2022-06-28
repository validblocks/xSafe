function fallbackCopyTextToClipboard(text: string) {
  let success = false;

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
    success = true;
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);

  return success;
}

export default async function copyTextToClipboard(text: string) {
  let success = false;

  if (!navigator.clipboard) {
    success = fallbackCopyTextToClipboard(text);
  } else {
    success = await navigator.clipboard.writeText(text).then(
      () => true,
      (err) => {
        console.error('Async: Could not copy text: ', err);
        return false;
      }
    );
  }

  return success;
}
