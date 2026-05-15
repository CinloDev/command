/**
 * Translator Module
 * Handles API calls to MyMemory Translation Service and language detection logic.
 */

export const translator = {
  /**
   * Translates text using MyMemory API
   * @param {string} text - The text to translate
   * @param {string} from - Source language code (e.g., 'es')
   * @param {string} to - Target language code (e.g., 'en')
   * @returns {Promise<string|null>} - Translated text or null if failed
   */
  async translate(text, from, to) {
    if (!text) return null;
    
    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
      const data = await response.json();
      
      if (data.responseData && data.responseData.translatedText) {
        return data.responseData.translatedText;
      }
      return null;
    } catch (error) {
      console.error('Translation error:', error);
      return null;
    }
  },

  /**
   * Simple check if text contains Spanish-specific characters or common words
   * @param {string} text 
   * @returns {boolean}
   */
  isSpanish(text) {
    if (!text) return false;
    const spanishRegex = /[áéíóúüñ]/i;
    const commonSpanishWords = /\b(el|la|los|las|un|una|con|por|para|en|de|que|si|no)\b/i;
    return spanishRegex.test(text) || commonSpanishWords.test(text);
  }
};
