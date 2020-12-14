export default function htmlEscape(text) {
  return text
    .replace('&', '&amp;')
    .replace('>', '&gt;')
    .replace('<', '&lt;')
    .replace('"', '&quot;')
    .replace("'", '&#39;');
}