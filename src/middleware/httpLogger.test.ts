import { describe, expect, it, vi } from "vitest";

vi.mock("morgan", () => {
  const mockMorgan = vi.fn(() => "morgan-middleware");
  return {
    __esModule: true,
    default: mockMorgan,
  };
});

import morgan from "morgan";
import { httpLogger } from "./httpLogger.js";

describe("httpLogger middleware", () => {
  it("configura Morgan con il formato personalizzato", () => {
    const mockMorgan = vi.mocked(morgan);

    expect(mockMorgan).toHaveBeenCalledTimes(1);

    const [format] = mockMorgan.mock.calls[0];

    expect(format).toContain("Method: :method");
    expect(format).toContain("Url: :url");
    expect(format).toContain("Status: :status");
    expect(format).toContain("Response Time: :response-time");
    expect(format).toContain("Size: :res[content-length]");
    expect(httpLogger).toBe("morgan-middleware");
  });
});
