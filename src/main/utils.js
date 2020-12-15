export function htmlEscape(text) {
  return text
    .replace('&', '&amp;')
    .replace('>', '&gt;')
    .replace('<', '&lt;')
    .replace('"', '&quot;')
    .replace("'", '&#39;');
}

export function pdfTextAdjust(array) {
  let text = "";
  for (let i = 0; i < array.length; i++) {
    let str = array[i];
    if (i !== array.length - 1) {
      if (str[str.length - 1] === "-") {
        text = text + str.slice(0, str.length - 1);
      } else {
        text = text + str + " "; 
      }  
    } else {
      text = text + str;
    }
  }
  return text;
}
