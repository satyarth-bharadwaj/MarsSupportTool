const handleTextSelection = (text: string) => {
  let isMatch = false;
  const regexPatterns = {
    issuedToCustomerId:
      /^"issuedToCustomerId": "trn:tesco:uid:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"/,
  };
  if (text.startsWith("trn:tesco:uid:uuid:")) {
    const regex =
      /^trn:tesco:uid:uuid:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
    isMatch = regex.test(text);
  }
  if (!isMatch) {
    // Check if selected text matches any of the regex patterns
    for (const [, regex] of Object.entries(regexPatterns)) {
      if (regex.test(text)) {
        isMatch = true;
        break;
      }
    }
  }
  if (text && isMatch) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return {};

    const range = selection.getRangeAt(0).getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const style: React.CSSProperties = {
      position: "absolute",
      top: `${range.bottom + scrollY}px`,
      left: `${range.left + scrollX}px`,
      color: "black",
      zIndex: 999,
      maxHeight: "200px",
      overflowY: "auto",
      marginTop: "20px",
    };
    return style;
  } else {
    return { display: "none" };
  }
};
export default handleTextSelection;
