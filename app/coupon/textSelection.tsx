import React from "react";

const handleTextSelection = (text: string) => {
  let isMatch = false;

  const regexPatterns = {
    promotionId:
      /^"promotionId": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"/,
    couponId:
      /^"couponId": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"/,
    scannableCode: /^"scannableCode": "[0-9]{22}"/,
    issuedToCustomerId:
      /^"issuedToCustomerId": "trn:tesco:uid:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"/,
    keyInCode: /^"keyInCode": "[A-Z0-9]{12}"/,
  };
  const regex =
    /^(?:(?:\d{22})|(?:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})|(?:[A-Z0-9]{12}))$/;
  isMatch = regex.test(text);
  if (!isMatch) {
    const regex2 =
      /^trn:tesco:uid:uuid:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
    isMatch = regex2.test(text);
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

  if (isMatch) {
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
