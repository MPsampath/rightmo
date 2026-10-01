import axios, { AxiosError } from "axios";
import {
  getApiErrorMessage,
  getValidationErrors,
  isValidationError,
} from "@/lib/errors";

function makeAxiosError(status: number, data: unknown): AxiosError {
  const error = new AxiosError("Request failed");
  error.response = {
    status,
    data,
    statusText: "",
    headers: {},
    config: {} as never,
  };
  return error;
}

describe("isValidationError", () => {
  it("returns true for a 422 axios error", () => {
    expect(isValidationError(makeAxiosError(422, {}))).toBe(true);
  });

  it("returns false for a non-422 axios error", () => {
    expect(isValidationError(makeAxiosError(500, {}))).toBe(false);
  });

  it("returns false for a non-axios error", () => {
    expect(isValidationError(new Error("boom"))).toBe(false);
  });
});

describe("getValidationErrors", () => {
  it("extracts the errors map from a 422 response", () => {
    const error = makeAxiosError(422, {
      message: "Validation failed",
      errors: { name: ["The name field is required."] },
    });
    expect(getValidationErrors(error)).toEqual({
      name: ["The name field is required."],
    });
  });

  it("returns an empty object when there are no errors", () => {
    expect(getValidationErrors(new Error("boom"))).toEqual({});
  });
});

describe("getApiErrorMessage", () => {
  it("returns the server message when present", () => {
    const error = makeAxiosError(500, { message: "Something broke on the server." });
    expect(getApiErrorMessage(error)).toBe("Something broke on the server.");
  });

  it("returns the fallback message when the server sent none", () => {
    const error = makeAxiosError(500, {});
    expect(getApiErrorMessage(error, "fallback")).toBe("fallback");
  });

  it("returns the fallback message for non-axios errors", () => {
    expect(getApiErrorMessage(new Error("boom"), "fallback")).toBe("fallback");
  });

  it("works with axios.isAxiosError integration", () => {
    expect(axios.isAxiosError(makeAxiosError(422, {}))).toBe(true);
  });
});
