import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Nav } from "./Nav";

describe("Nav", () => {
  const products = {
    label: "Products",
    items: [
      { label: "squish", href: "/products/squish" },
      { label: "vectro", href: "/products/vectro" },
    ],
  };

  it("renders default brand wordmark linked to /", () => {
    render(<Nav />);
    const brand = screen.getByRole("link", { name: "KonjoAI" });
    expect(brand).toHaveAttribute("href", "/");
  });

  it("renders products menu and links the items", () => {
    render(<Nav products={products} />);
    expect(screen.getByLabelText("Products menu")).toBeInTheDocument();
    // Each product link rendered (desktop + mobile menu copies — collect by href).
    expect(screen.getAllByRole("link", { name: "squish" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "vectro" })[0]).toHaveAttribute(
      "href",
      "/products/vectro",
    );
  });

  it("marks external links with target=_blank and rel=noreferrer", () => {
    render(
      <Nav
        links={[{ label: "GitHub", href: "https://github.com/konjoai", external: true }]}
      />,
    );
    const link = screen.getAllByRole("link", { name: "GitHub" })[0];
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("accepts custom brand ReactNode and brandHref", () => {
    render(<Nav brand={<span data-testid="brand">k.</span>} brandHref="/home" />);
    expect(screen.getByTestId("brand")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "k." })).toHaveAttribute("href", "/home");
  });

  it("includes a mobile menu toggle when there is content to show", () => {
    render(<Nav products={products} />);
    expect(screen.getByLabelText("Open menu")).toBeInTheDocument();
  });
});
