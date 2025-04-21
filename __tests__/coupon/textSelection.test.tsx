import handleTextSelection from "~/coupon/textSelection";

describe("handleTextSelection", () => {
  beforeEach(() => {
    // Mock getSelection globally for each test
    global.getSelection = vi.fn();
  });

  afterEach(() => {
    // Restore original getSelection
    vi.restoreAllMocks();
  });

  test("should match a plain text regex", () => {
    const text = "1234567890123456789012";
    (global.getSelection as vi.Mock).mockReturnValue({
      rangeCount: 1,
      getRangeAt: () => ({
        getBoundingClientRect: () => ({
          bottom: 100,
          left: 100,
        }),
      }),
    });

    window.scrollY = 10;
    window.scrollX = 20;

    const style = handleTextSelection(text);
    expect(style).toEqual({
      position: "absolute",
      top: "110px",
      left: "120px",
      color: "black",
      zIndex: 999,
      maxHeight: "200px",
      overflowY: "auto",
      marginTop: "20px",
    });
  });

  test("should match a UUID regex", () => {
    const text = "trn:tesco:uid:uuid:123e4567-e89b-12d3-a456-426614174000";
    (global.getSelection as vi.Mock).mockReturnValue({
      rangeCount: 1,
      getRangeAt: () => ({
        getBoundingClientRect: () => ({
          bottom: 200,
          left: 200,
        }),
      }),
    });

    window.scrollY = 20;
    window.scrollX = 30;

    const style = handleTextSelection(text);
    expect(style).toEqual({
      position: "absolute",
      top: "220px",
      left: "230px",
      color: "black",
      zIndex: 999,
      maxHeight: "200px",
      overflowY: "auto",
      marginTop: "20px",
    });
  });

  test("should match a regex pattern from regexPatterns", () => {
    const text = '"promotionId": "123e4567-e89b-12d3-a456-426614174000"';
    (global.getSelection as vi.Mock).mockReturnValue({
      rangeCount: 1,
      getRangeAt: () => ({
        getBoundingClientRect: () => ({
          bottom: 300,
          left: 300,
        }),
      }),
    });

    window.scrollY = 30;
    window.scrollX = 40;

    const style = handleTextSelection(text);
    expect(style).toEqual({
      position: "absolute",
      top: "330px",
      left: "340px",
      color: "black",
      zIndex: 999,
      maxHeight: "200px",
      overflowY: "auto",
      marginTop: "20px",
    });
  });

  test("should return display:none if text does not match any regex", () => {
    const text = "invalid text";
    const style = handleTextSelection(text);
    expect(style).toEqual({ display: "none" });
  });

  test("should handle when window.getSelection is null", () => {
    (global.getSelection as vi.Mock).mockReturnValue(null);

    const text = "trn:tesco:uid:uuid:123e4567-e89b-12d3-a456-426614174000";
    const style = handleTextSelection(text);
    expect(style).toEqual({});
  });
});
