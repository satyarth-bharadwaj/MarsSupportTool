const extractNeededText = (regexPatterns: RegExp[], selectedText: string) => {
  for (const pattern of regexPatterns) {
    const regex = new RegExp(pattern);
    const match = selectedText.match(regex);
    if (match && match.length > 1) {
      const extractedText = match[1];
      return extractedText;
    }
  }
  return selectedText; // Return null if no match or match doesn't have expected length for any of the patterns
};
export default extractNeededText;
