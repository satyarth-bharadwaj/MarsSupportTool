import getCookieValue from "~/routes/resources/getCookie";

describe("getCookieValue", () => {
  it("should return null when cookieString is null", async () => {
    const cookieString: string | null = null;
    const value = await getCookieValue(cookieString);
    expect(value).toBeNull();
  });

  it('should return the value corresponding to the key "db"', async () => {
    const cookieString = "key1=value1; key2=value2; db=testValue; key3=value3";
    const value = await getCookieValue(cookieString);
    expect(value).toEqual("testValue");
  });

  it('should return null if the key "db" is not found in cookieString', async () => {
    const cookieString = "key1=value1; key2=value2; key3=value3";
    const value = await getCookieValue(cookieString);
    expect(value).toBeNull();
  });

  it("should handle whitespace around key-value pairs", async () => {
    const cookieString = "  key1=value1 ;  db=testValue ; key3=value3  ";
    const value = await getCookieValue(cookieString);
    expect(value).toEqual("testValue");
  });

  it("should handle a single key-value pair", async () => {
    const cookieString = "db=testValue";
    const value = await getCookieValue(cookieString);
    expect(value).toEqual("testValue");
  });
});
