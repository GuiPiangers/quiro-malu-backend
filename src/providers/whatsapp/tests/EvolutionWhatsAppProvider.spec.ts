import axios from "axios";
import { EvolutionWhatsAppProvider } from "../EvolutionWhatsAppProvider";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("EvolutionWhatsAppProvider", () => {
  const baseUrl = "http://localhost:8080";
  const apiKey = "api-key";
  const instance = "instance";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return success true and providerMessageId on 2xx", async () => {
    mockedAxios.post.mockResolvedValue({
      data: { key: { id: "provider-id" } },
    } as any);

    const provider = new EvolutionWhatsAppProvider(baseUrl, apiKey, instance);

    const result = await provider.sendMessage({
      to: "5551999999999",
      body: "hello",
    });

    expect(result).toEqual({ success: true, providerMessageId: "provider-id" });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${baseUrl}/message/sendText/${instance}`,
      { number: "5551999999999", text: "hello" },
      expect.objectContaining({
        headers: expect.objectContaining({ apikey: apiKey }),
      }),
    );
  });

  it("should return success false with errorMessage when API returns error payload", async () => {
    mockedAxios.post.mockRejectedValue({
      response: { data: { message: "Invalid" } },
    });

    const provider = new EvolutionWhatsAppProvider(baseUrl, apiKey, instance);

    const result = await provider.sendMessage({
      to: "5551999999999",
      body: "hello",
    });

    expect(result).toEqual({ success: false, errorMessage: "Invalid" });
  });

  it("should return success false with errorMessage when network throws", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Network"));

    const provider = new EvolutionWhatsAppProvider(baseUrl, apiKey, instance);

    const result = await provider.sendMessage({
      to: "5551999999999",
      body: "hello",
    });

    expect(result).toEqual({ success: false, errorMessage: "Network" });
  });
});
