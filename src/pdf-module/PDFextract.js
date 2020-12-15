import { createPromiseCapability } from "pdfjs-dist";
import { pdfTextAdjust } from "../main/utils";


const CHARACTERS_TO_NORMALIZE = {
  "\u2018": "'", // Left single quotation mark
  "\u2019": "'", // Right single quotation mark
  "\u201A": "'", // Single low-9 quotation mark
  "\u201B": "'", // Single high-reversed-9 quotation mark
  "\u201C": '"', // Left double quotation mark
  "\u201D": '"', // Right double quotation mark
  "\u201E": '"', // Double low-9 quotation mark
  "\u201F": '"', // Double high-reversed-9 quotation mark
  "\u00BC": "1/4", // Vulgar fraction one quarter
  "\u00BD": "1/2", // Vulgar fraction one half
  "\u00BE": "3/4", // Vulgar fraction three quarters
};

let normalizationRegex = null;
function normalize(text) {
  if (!normalizationRegex) {
    // Compile the regular expression for text normalization once.
    const replace = Object.keys(CHARACTERS_TO_NORMALIZE).join("");
    normalizationRegex = new RegExp(`[${replace}]`, "g");
  }
  return text.replace(normalizationRegex, function (ch) {
    return CHARACTERS_TO_NORMALIZE[ch];
  });
}

export default class PDFExtractor {
  constructor(pdf, endPage) {
    this.pdf = pdf;
    this.endPage = endPage;
    this._extractTextPromises = [];
    this.pageContents = [];
  }

  extractText() {
    // Perform text extraction once if this method is called multiple times.
    if (this._extractTextPromises.length > 0) {
      return;
    }
  
    let promise = Promise.resolve();
    for (let i = 0, ii = this.endPage; i < ii; i++) {
      const extractTextCapability = createPromiseCapability();
      this._extractTextPromises[i] = extractTextCapability.promise;
  
      promise = promise.then(() => {
        return this.pdf
          .getPage(i + 1)
          .then(pdfPage => {
            return pdfPage.getTextContent({
              normalizeWhitespace: true,
            });
          })
          .then(
            textContent => {
              const textItems = textContent.items;
  
              const textStrArray = textItems.map(x => x.str);

              const text = pdfTextAdjust(textStrArray);
  
              // Store the normalized page content (text items) as one string.
              this.pageContents[i] = normalize(text);
              extractTextCapability.resolve(i);
            },
            reason => {
              console.error(
                `Unable to get text content for page ${i + 1}`,
                reason
              );
              // Page error -- assuming no text content.
              this.pageContents[i] = "";
              extractTextCapability.resolve(i);
            }
          );
      });
    }

    return promise;
  }
}
