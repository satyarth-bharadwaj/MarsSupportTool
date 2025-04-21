import handleTextSelection from "~/points/textSelection";
describe("handleTextSelection", () => {
  beforeEach(() => {
    // Mock window.getSelection
    global.getSelection = vi.fn().mockReturnValue({
      rangeCount: 1,
      getRangeAt: vi.fn().mockReturnValue({
        getBoundingClientRect: vi.fn().mockReturnValue({
          bottom: 100,
          left: 100,
        }),
      }),
    });

    // Mock window.scrollY and window.scrollX
    Object.defineProperty(window, "scrollY", { value: 50, writable: true });
    Object.defineProperty(window, "scrollX", { value: 30, writable: true });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should return style for valid UUID text starting with "trn:tesco:uid:uuid:"', () => {
    const text = "trn:tesco:uid:uuid:123e4567-e89b-12d3-a456-426614174000";
    const style = handleTextSelection(text);
    expect(style).toEqual({
      position: "absolute",
      top: "150px", // 100 (range.bottom) + 50 (scrollY)
      left: "130px", // 100 (range.left) + 30 (scrollX)
      color: "black",
      zIndex: 999,
      maxHeight: "200px",
      overflowY: "auto",
      marginTop: "20px",
    });
  });

  test("should return style for text matching issuedToCustomerId pattern", () => {
    const text =
      '"issuedToCustomerId": "trn:tesco:uid:uuid:123e4567-e89b-12d3-a456-426614174000"';
    const style = handleTextSelection(text);
    expect(style).toEqual({
      position: "absolute",
      top: "150px",
      left: "130px",
      color: "black",
      zIndex: 999,
      maxHeight: "200px",
      overflowY: "auto",
      marginTop: "20px",
    });
  });

  test("should return display none for text not matching any pattern", () => {
    const text = "invalid text";
    const style = handleTextSelection(text);
    expect(style).toEqual({ display: "none" });
  });

  test("should handle when window.getSelection is null", () => {
    // Mock getSelection to return null
    (global.getSelection as vi.Mock).mockReturnValue(null);

    const text = "trn:tesco:uid:uuid:123e4567-e89b-12d3-a456-426614174000";
    const style = handleTextSelection(text);
    expect(style).toEqual({});
  });
});
