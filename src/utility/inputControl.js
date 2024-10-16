export function adjustHeight(textarea) {
  const lineBreaks = (textarea.value.match(/\n/g) || []).length;
  const charCount = textarea.value.length;
  const baseHeight = 40;
  const extraHeight = (Math.floor(charCount / 26) + lineBreaks) * 10;
  const maxHeight = 100;
  textarea.style.height = `${Math.min(baseHeight + extraHeight, maxHeight)}px`;
}
