import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormInput from "@/components/FormInput";

describe("FormInput", () => {
  it("renders a label linked to the input", () => {
    render(<FormInput label="Name" name="name" />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("does not show an error state when no error is given", () => {
    render(<FormInput label="Name" name="name" />);
    const input = screen.getByLabelText("Name");
    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(input.className).not.toContain("border-red-400");
  });

  it("shows the first error message and marks the field invalid", () => {
    render(
      <FormInput
        label="Name"
        name="name"
        error={["Name is required.", "Name must be unique."]}
      />
    );
    const input = screen.getByLabelText("Name");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.className).toContain("border-red-400");
    expect(screen.getByText("Name is required.")).toBeInTheDocument();
    expect(screen.queryByText("Name must be unique.")).not.toBeInTheDocument();
  });

  it("forwards input events to the caller", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<FormInput label="Name" name="name" value="" onChange={handleChange} />);

    await user.type(screen.getByLabelText("Name"), "a");

    expect(handleChange).toHaveBeenCalled();
  });
});
