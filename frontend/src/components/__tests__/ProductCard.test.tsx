import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

const product: Product = {
  id: 1,
  name: "Wireless Mouse",
  category_id: 2,
  category: { id: 2, name: "Electronics" },
  price: 29.99,
  rating: 4.2,
  image_path: null,
  image_url: null,
};

describe("ProductCard", () => {
  it("renders product details for public (non-admin) view", () => {
    render(<ProductCard product={product} />);

    expect(screen.getByText("Wireless Mouse")).toBeInTheDocument();
    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("falls back to Uncategorized when there is no category", () => {
    render(<ProductCard product={{ ...product, category: null }} />);
    expect(screen.getByText("Uncategorized")).toBeInTheDocument();
  });

  it("renders Edit/Delete actions for admins and invokes callbacks", async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(<ProductCard product={product} isAdmin onEdit={onEdit} onDelete={onDelete} />);

    await user.click(screen.getByText("Edit"));
    expect(onEdit).toHaveBeenCalledWith(product);

    await user.click(screen.getByText("Delete"));
    expect(onDelete).toHaveBeenCalledWith(product);
  });

  it("links the product name to its detail page", () => {
    render(<ProductCard product={product} />);
    const link = screen.getByRole("link", { name: "Wireless Mouse" });
    expect(link).toHaveAttribute("href", "/products/1");
  });
});
