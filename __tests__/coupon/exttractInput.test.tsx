import extractNeededText from "~/coupon/extractInput";

describe("extractNeededText function", () => {
  it("should return the extracted text when a match is found", () => {
    const regexPatterns = [
      /"promotionId": "([^"]+)"/,
      /"couponId": "([^"]+)"/,
      /"scannableCode": "([^"]+)"/,
      /"keyInCode": "([^"]+)"/,
    ];
    const selectedText =
      '"promotionId": "1478da17-526f-4320-9591-3c2aae7aee99"';

    expect(extractNeededText(regexPatterns, selectedText)).toBe(
      "1478da17-526f-4320-9591-3c2aae7aee99"
    );
  });

  it("should return null when no match is found", () => {
    const regexPatterns = [/"issuedToCustomerId": "([^"]+)"/];
    const selectedText =
      '"promotionId": "1478da17-526f-4320-9591-3c2aae7aee99"';

    expect(extractNeededText(regexPatterns, selectedText)).toBe(selectedText);
  });

  it("should return the extracted text from the first match if multiple matches are found", () => {
    const regexPatterns = [
      /"promotionId": "([^"]+)"/,
      /"couponId": "([^"]+)"/,
      /"scannableCode": "([^"]+)"/,
      /"keyInCode": "([^"]+)"/,
    ];
    const selectedText =
      '"promotionId": "1478da17-526f-4320-9591-3c2aae7aee99"},{"promotionId": "e2a1d9fb-f57a-4df6-9c0a-f758e996a033},{"promotionId": "0010901e-3637-46a8-9adf-ec35e0fb6750}"';

    expect(extractNeededText(regexPatterns, selectedText)).toBe(
      "1478da17-526f-4320-9591-3c2aae7aee99"
    );
  });

  it("should handle empty regex patterns array", () => {
    const regexPatterns: RegExp[] = [];
    const selectedText =
      '"promotionId": "1478da17-526f-4320-9591-3c2aae7aee99"';

    expect(extractNeededText(regexPatterns, selectedText)).toBe(selectedText);
  });

  it("should handle empty selectedText", () => {
    const regexPatterns = [
      /"promotionId": "([^"]+)"/,
      /"couponId": "([^"]+)"/,
      /"scannableCode": "([^"]+)"/,
      /"keyInCode": "([^"]+)"/,
    ];
    const selectedText = "";

    expect(extractNeededText(regexPatterns, selectedText)).toBe(selectedText);
  });
});
