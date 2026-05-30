import { Nav } from "@konjoai/ui";
import { PRODUCT_NAV_GROUP } from "@/lib/products";

export function SiteNav() {
  return (
    <Nav
      brand="KonjoAI"
      brandHref="/"
      products={PRODUCT_NAV_GROUP}
      links={[
        { label: "Status", href: "/status" },
        { label: "GitHub", href: "https://github.com/konjoai", external: true },
      ]}
    />
  );
}
