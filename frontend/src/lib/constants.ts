export const SITE_NAME = "ReThread";
export const SITE_NAME_KA = "რეთრედ";
export const SITE_TAGLINE = "Pre-loved clothes, a new life.";
export const SITE_TAGLINE_KA = "მეორადი ტანსაცმელი, ახალი სიცოცხლე.";

export const CATEGORIES = [
  "Tops",
  "Dresses",
  "Outerwear",
  "Trousers",
  "Skirts",
  "Shoes",
  "Accessories",
  "Bags",
] as const;

export const CONDITIONS = ["New with tags", "Like new", "Good", "Fair"] as const;

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export const CURRENCY_SYMBOL = "₾";
export const CURRENCY_CODE = "GEL";
export const COUNTRY = "Georgia";

// Georgian display labels (data stays in English under the hood for filtering/API)
export const CATEGORY_LABELS_KA: Record<string, string> = {
  Tops: "ზედატანები",
  Dresses: "კაბები",
  Outerwear: "ქურთუკები და პალტოები",
  Trousers: "შარვლები",
  Skirts: "კალთები",
  Shoes: "ფეხსაცმელი",
  Accessories: "აქსესუარები",
  Bags: "ჩანთები",
};

export const CONDITION_LABELS_KA: Record<string, string> = {
  "New with tags": "ახალი, ეტიკეტით",
  "Like new": "იდეალური",
  Good: "კარგი",
  Fair: "საშუალო",
};

export const CATEGORY_IMAGES: Record<string, string> = {
  Tops: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=500&q=80",
  Dresses: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80",
  Outerwear: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=500&q=80",
  Trousers: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&q=80",
  Skirts: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=500&q=80",
  Shoes: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80",
  Accessories: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=500&q=80",
  Bags: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=500&q=80",
};

// Hero editorial collage images (styled outfits)
export const HERO_IMAGES = {
  main: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
  top: "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=500&q=80",
  bottom: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=500&q=80",
  accent: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=500&q=80",
};

