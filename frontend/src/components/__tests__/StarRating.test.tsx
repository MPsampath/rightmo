import { render, screen } from "@testing-library/react";
import StarRating from "@/components/StarRating";

describe("StarRating", () => {
  it("renders an accessible label with the rounded rating value", () => {
    render(<StarRating rating={3.5} />);
    expect(screen.getByRole("img", { name: "Rated 3.5 out of 5 stars" })).toBeInTheDocument();
  });

  it("displays the formatted rating text", () => {
    render(<StarRating rating={4} />);
    expect(screen.getByText("4.0")).toBeInTheDocument();
  });

  it("clamps ratings above maxStars", () => {
    render(<StarRating rating={9} maxStars={5} />);
    expect(screen.getByRole("img", { name: "Rated 5 out of 5 stars" })).toBeInTheDocument();
  });

  it("clamps negative ratings to zero", () => {
    render(<StarRating rating={-2} />);
    expect(screen.getByRole("img", { name: "Rated 0 out of 5 stars" })).toBeInTheDocument();
    expect(screen.getByText("0.0")).toBeInTheDocument();
  });
});
