import { parseProductSearchParams } from "@/lib/products";

describe("parseProductSearchParams", () => {
  it("defaults to page 1 and undefined filters when empty", () => {
    expect(parseProductSearchParams({})).toEqual({
      search: undefined,
      category_id: undefined,
      min_price: undefined,
      max_price: undefined,
      sort_by: undefined,
      sort_dir: undefined,
      page: 1,
    });
  });

  it("parses string params into typed query params", () => {
    const result = parseProductSearchParams({
      search: "mouse",
      category_id: "3",
      min_price: "10",
      max_price: "100",
      sort_by: "price",
      sort_dir: "desc",
      page: "2",
    });

    expect(result).toEqual({
      search: "mouse",
      category_id: 3,
      min_price: 10,
      max_price: 100,
      sort_by: "price",
      sort_dir: "desc",
      page: 2,
    });
  });

  it("takes the first value when a param is an array", () => {
    const result = parseProductSearchParams({ search: ["first", "second"] });
    expect(result.search).toBe("first");
  });

  it("treats an empty string as undefined", () => {
    const result = parseProductSearchParams({ search: "", category_id: "" });
    expect(result.search).toBeUndefined();
    expect(result.category_id).toBeUndefined();
  });
});
