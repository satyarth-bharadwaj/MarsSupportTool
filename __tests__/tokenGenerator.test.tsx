import { generateIdentityToken } from "~/routes/resources/tokenGenerator";

describe("generateIdentityToken", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
  });

  it("should handle errors gracefully", async () => {
    vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Network error"));

    const credentials = "mocked_credentials";
    const dbValue = "PPE";
    const token = await generateIdentityToken(credentials, dbValue);

    expect(token).toEqual(JSON.stringify(new Error("Network error")));
  });
});
