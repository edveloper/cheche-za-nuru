const minorWords = new Set([
  "a", "an", "and", "as", "at", "but", "by", "for", "in", "nor", "of", "on", "or", "the", "to", "with",
]);

/**
 * House style: headings, labels and buttons are in Title Case. Use for text that comes
 * from the CMS, where editors may type sentence case ("Children reached").
 */
export function toTitleCase(text: string) {
  const words = text.trim().split(/\s+/);

  return words
    .map((word, index) => {
      const isEdge = index === 0 || index === words.length - 1;
      const lower = word.toLowerCase();

      if (!isEdge && minorWords.has(lower)) {
        return lower;
      }

      // Only the first letter changes, so acronyms like NGO keep their capitals.
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
