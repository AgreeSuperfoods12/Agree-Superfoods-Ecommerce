export type MainNavItem = {
  label: string;
  href: string;
  badge?: string;
  tone?: "sale" | "new";
};

export const mainNav: MainNavItem[] = [
  { label: "Shop", href: "/products" },
  { label: "Sale", href: "/products?tag=sale", badge: "50% OFF", tone: "sale" },
  { label: "About", href: "/about" },
  { label: "Features", href: "/features" },
];

export const megaColumns = [
  { heading: "By Need", links: [
    { label: "Energy", href: "/products?need=energy" },
    { label: "Immunity", href: "/products?need=immunity" },
    { label: "Gut Health", href: "/products?need=gut" },
    { label: "Stress / Sleep", href: "/products?need=stress" },
  ]},
  { heading: "By Type", links: [
    { label: "Powders", href: "/products?type=powder" },
    { label: "Capsules", href: "/products?type=capsule" },
    { label: "Snacks", href: "/products?type=snack" },
    { label: "Bundles", href: "/products?type=bundle" },
  ]},
  { heading: "By Ingredient", links: [
    { label: "Moringa", href: "/products?ig=moringa" },
    { label: "Spirulina", href: "/products?ing=spirulina" },
    { label: "Ashwagandha", href: "/products?ing=ashwagandha" },
    { label: "Turmeric", href: "/products?ing=turmeric" },
  ]},
  { heading: "Featured", links: [
    { label: "Best Sellers", href: "/products?tag=best" },
    { label: "New Arrivals", href: "/products?sort=new" },
    { label: "Seasonal Sale", href: "/products?tag=sale" },
    { label: "Bundle Deals", href: "/products?type=bundle" },
  ]},
];
