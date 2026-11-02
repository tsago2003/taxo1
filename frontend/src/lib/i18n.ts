import { CATEGORY_LABELS_KA, CONDITION_LABELS_KA } from "./constants";

export type Language = "ka" | "en";

/**
 * Georgian-first UI dictionary.
 * NOTE: `Fira Go` and `BPG Arial` are the preferred Georgian brand faces.
 * We ship `Noto Sans Georgian` from Google Fonts as a zero-setup fallback so
 * the site renders beautifully immediately — swap in self-hosted Fira Go /
 * BPG Arial files later without touching component code.
 */
export const ka = {
  // Brand & tagline
  siteTagline: "მეორადი ტანსაცმელი, ახალი სიცოცხლე.",
  siteNameKa: "რეთრედ",

  // Navigation
  "nav.shop": "მაღაზია",
  "nav.stories": "ისტორიები",
  "nav.about": "ჩვენ შესახებ",
  "nav.sellWithUs": "გაყიდე ჩვენთან",
  "nav.cart": "კალათა",
  "nav.wishlist": "ფავორიტები",
  "nav.heart": "გული",
  "nav.signIn": "შესვლა",
  "nav.signOut": "გასვლა",
  "nav.myAccount": "ჩემი ანგარიში",
  "nav.dashboard": "მართვის პანელი",
  "nav.searchPlaceholder": "მოძებნე ტანსაცმელი, ბრენდი…",

  // Language switcher
  "lang.ka": "ქარ",
  "lang.en": "Eng",
  "lang.label": "ენა",

  // Hero
  "hero.badge": "მდგრადი მოდა საქართველოში",
  "hero.title": "მეორადი ტანსაცმელი, ახალი სიცოცხლე.",
  "hero.subtitle":
    "აღმოაჩინე უნიკალური, ხარისხმოწმენდილი მეორადი ტანსაცმელი სანდო ადგილობრივი მაღაზიებიდან.",
  "hero.searchPlaceholder": "რას ეძებ დღეს?",
  "hero.searchButton": "ძებნა",
  "hero.trust.quality": "ხარისხი შემოწმებულია",
  "hero.trust.local": "ადგილობრივი მაღაზიები",
  "hero.trust.gel": "ფასები ლარში (₾)",
  "hero.tag.trusted": "სანდო",
  "hero.tag.localShops": "ადგილობრივი მაღაზიები",
  "hero.tag.from": "დან",

  // Section headings
  "section.shopByCategory": "იყიდე კატეგორიის მიხედვით",
  "section.browseAll": "იხილე ყველა",
  "section.trending": "ტრენდული ახლა",
  "section.newArrivals": "ახალი ჩამოსული",
  "section.recommended": "რეკომენდირებული შენთვის",
  "section.recommendedSub": "შენი ინტერესებიდან გამომდინარე შერჩეული, {name}.",
  "section.viewAll": "იხილე ყველა →",

  // Why shop with us
  "why.sustainable": "მდგრადი",
  "why.sustainableSub":
    "ყოველი შენაძენი ტანსაცმელს მეორე სიცოცხლეს აძლევს და ნაგავსაყრელს აშორებს.",
  "why.unique": "უნიკალური ნივთები",
  "why.uniqueSub": "ერთი ეგზემპლარის ნივთები, რომლებსაც სხვაგან ვერ ნახავ.",
  "why.local": "ადგილობრივის მხარდაჭერა",
  "why.localSub":
    "იყიდე პირდაპირ დამოუკიდებელი მეორადი მაღაზიებიდან საქართველოში.",

  // Seller CTA
  "cta.title": "მეორადი მაღაზია ხარ?",
  "cta.subtitle":
    "დაამატე შენი ნივთები {site}-ზე, მიაღწიე მეტ მომხმარებელს და მართე შეკვეთები ერთი მარტივი პანელიდან.",
  "cta.button": "შექმენი მაღაზიის ანგარიში",

  // Product card
  "product.addToCart": "კალათაში დამატება",
  "product.added": "დამატებულია ✓",
  "product.soldOut": "გაყიდულია",
  "product.sold": "გაყიდულია",
  "product.size": "ზომა {size}",
  "product.oneSize": "ერთი ზომა",
  "product.wishlistAdd": "ფავორიტებში დამატება",
  "product.wishlistRemove": "ფავორიტებიდან წაშლა",

  // Shop / catalog
  "shop.title": "იყიდე მეორადი ტანსაცმელი",
  "shop.subtitle": "ხარისხმოწმენდილი ნივთები სანდო ადგილობრივი მაღაზიებიდან.",
  "shop.found": "მოიძებნა {count} ტანსაცმელი",
  "shop.loading": "იტვირთება…",
  "shop.empty":
    "შენს ფილტრებს არცერთი ტანსაცმელი არ შეესაბამება. სცადე ფილტრების გასუფთავება.",

  // Filters
  "filter.title": "ფილტრები",
  "filter.category": "კატეგორია",
  "filter.size": "ზომა",
  "filter.condition": "მდგომარეობა",
  "filter.sort": "დალაგება",
  "filter.allCategories": "ყველა კატეგორია",
  "filter.allSizes": "ყველა ზომა",
  "filter.allConditions": "ყველა მდგომარეობა",
  "filter.sortNewest": "ახალი ჯერ",
  "filter.sortPriceAsc": "ფასი: ზრდადი",
  "filter.sortPriceDesc": "ფასი: კლებადი",
  "filter.clear": "ფილტრების გასუფთავება",
  "filter.search": "ძებნა",
  "filter.minPrice": "მინ. ფასი",
  "filter.maxPrice": "მაქს. ფასი",
  "filter.price": "ფასი",
  "filter.searchPlaceholder": "მოძებნე ტანსაცმელი, ბრენდი…",

  // Product detail
  "detail.back": "← მაღაზიაში დაბრუნება",
  "detail.loading": "იტვირთება…",
  "detail.condition": "მდგომარეობა",
  "detail.category": "კატეგორია",
  "detail.size": "ზომა",
  "detail.brand": "ბრენდი",
  "detail.shop": "მაღაზია",
  "detail.unbranded": "ბრენდის გარეშე",
  "detail.unknownShop": "უცნობი",
  "detail.moreLikeThis": "მსგავსი ნივთები",
  "detail.defaultDescription": "ეს მეორადი ნივთი მზადაა ახალი სახლისთვის.",

  // Cart
  "cart.title": "შენი კალათა",
  "cart.empty": "შენი კალათა ცარიელია",
  "cart.emptySub":
    "დაათვალიერე ჩვენი მეორადი კოლექცია და იპოვე რამე, რაც შეგიყვარდება.",
  "cart.startShopping": "დაიწყე შოპინგი",
  "cart.remove": "წაშლა",
  "cart.decrease": "რაოდენობის შემცირება",
  "cart.increase": "რაოდენობის გაზრდა",
  "cart.shippingNote":
    "მიტანის პირობებს გამყიდველი დააზუსტებს შენი შეკვეთის შემდეგ.",
  "cart.total": "ჯამი",
  "cart.checkout": "გადასახდელად",

  // Checkout
  "checkout.title": "გადახდა",
  "checkout.empty": "შენი კალათა ცარიელია",
  "checkout.browse": "დაათვალიერე ნივთები",
  "checkout.contact": "საკონტაქტო და მიტანის ინფორმაცია",
  "checkout.name": "სრული სახელი *",
  "checkout.email": "ელფოსტა *",
  "checkout.phone": "ტელეფონი *",
  "checkout.address": "მისამართი *",
  "checkout.city": "ქალაქი",
  "checkout.postal": "საფოსტო კოდი",
  "checkout.notes": "შენიშვნა გამყიდველს (სურვილისამებრ)",
  "checkout.placeOrder": "შეკვეთის გაფორმება",
  "checkout.placing": "მიმდინარეობს…",
  "checkout.summary": "შეკვეთის რეზიუმე",
  "checkout.qty": "რაოდენობა {qty}",

  // Auth
  "auth.welcomeBack": "კეთილი იყოს შენი დაბრუნება",
  "auth.signInSub": "შედი შენს მომხმარებლის ანგარიშში.",
  "auth.email": "ელფოსტა",
  "auth.password": "პაროლი",
  "auth.fullName": "სრული სახელი",
  "auth.signIn": "შესვლა",
  "auth.signingIn": "შესვლა…",
  "auth.newHere": "ახალი ხარ?",
  "auth.createAccount": "შექმენი ანგარიში",
  "auth.sellerPrompt": "მაღაზიის მფლობელი ხარ?",
  "auth.sellerSignIn": "გამყიდველის შესვლა",
  "auth.createAccountTitle": "შექმენი შენი ანგარიში",
  "auth.createAccountSub": "შეინახე ფავორიტები და თვალყური ადევნე შეკვეთებს.",
  "auth.createAccountBtn": "ანგარიშის შექმნა",
  "auth.creatingAccount": "ანგარიში იქმნება…",
  "auth.alreadyHave": "უკვე გაქვს ანგარიში?",
  "auth.sellingClothes": "ყიდი ტანსაცმელს?",
  "auth.createShopAccount": "შექმენი მაღაზიის ანგარიში",
  "auth.sellerSignInTitle": "გამყიდველის შესვლა",
  "auth.sellerSignInSub": "მართე შენი მაღაზია, ნივთები და შეკვეთები.",
  "auth.createShopTitle": "შექმენი შენი მაღაზია",
  "auth.createShopSub": "დაიწყე მეორადი ტანსაცმლის გაყიდვა წუთებში.",
  "auth.shopName": "მაღაზიის სახელი",
  "auth.shopNamePlaceholder": "მაგ. ვინტაჟური ვიბი",
  "auth.newShop": "ახალი მაღაზია?",
  "auth.alreadyHaveShop": "უკვე გაქვს მაღაზია?",
  "auth.demoBuyer": "დემო მყიდველი: buyer@example.com / buyer1234",
  "auth.demoShop": "დემო მაღაზია: demo@thrift-shop.com / demo1234",

  // Order confirmation
  "order.thankYou": "გმადლობთ შეკვეთისთვის!",
  "order.placed": "შენი შეკვეთა წარმატებით განთავსდა.",
  "order.totalPaid": "გადახდილია",
  "order.willConfirm":
    "გამყიდველი მალე გადახედავს და დაადასტურებს შენს შეკვეთას. განახლებებს მიიღებ ელფოსტაზე.",
  "order.continue": "გააგრძელე შოპინგი",

  // Account
  "account.hi": "გამარჯობა, {name}",
  "account.forYou": "შენთვის",
  "account.orders": "შეკვეთები",
  "account.wishlist": "ფავორიტები",
  "account.noRecommendations":
    "დაათვალიერე რამდენიმე ნივთი და დავიწყებთ იმის გაგებას, რაც გიყვარს.",
  "account.noOrders": "შეკვეთები ჯერ არ გაქვს.",
  "account.emptyWishlist":
    "შენი ფავორიტები ცარიელია. დააჭირე გულს ნებისმიერ ნივთზე, რომ აქ შეინახო.",
  "account.order": "შეკვეთა #{id}",

  // Footer
  "footer.tagline":
    "შეიძინე მდგრადად და მიეცი ხარისხიან ტანსაცმელს მეორე სიცოცხლე.",
  "footer.shop": "მაღაზია",
  "footer.allProducts": "ყველა ნივთი",
  "footer.becomeSeller": "გახდი გამყიდველი",
  "footer.sellerLogin": "გამყიდველის შესვლა",
  "footer.categories": "კატეგორიები",
  "footer.rights": "ყველა უფლება დაცულია.",
  "footer.serving": "მომსახურება",

  // Misc
  "common.search": "ძებნა",
  "common.loading": "იტვირთება…",
} as const;

export type TranslationKey = keyof typeof ka;

export const en: Record<TranslationKey, string> = {
  siteTagline: "Pre-loved clothes, a new life.",
  siteNameKa: "ReThread",

  "nav.shop": "Shop",
  "nav.stories": "Stories",
  "nav.about": "About",
  "nav.sellWithUs": "Sell with us",
  "nav.cart": "Cart",
  "nav.wishlist": "Wishlist",
  "nav.heart": "Heart",
  "nav.signIn": "Sign in",
  "nav.signOut": "Sign out",
  "nav.myAccount": "My account",
  "nav.dashboard": "Dashboard",
  "nav.searchPlaceholder": "Search clothes, brands…",

  "lang.ka": "ქარ",
  "lang.en": "Eng",
  "lang.label": "Language",

  "hero.badge": "Sustainable fashion in Georgia",
  "hero.title": "Pre-loved clothes, a new life.",
  "hero.subtitle":
    "Discover unique, quality-checked pre-loved clothes from trusted local second-hand shops.",
  "hero.searchPlaceholder": "What are you looking for today?",
  "hero.searchButton": "Search",
  "hero.trust.quality": "Quality checked",
  "hero.trust.local": "Local shops",
  "hero.trust.gel": "Prices in GEL (₾)",
  "hero.tag.trusted": "Trusted",
  "hero.tag.localShops": "Local shops",
  "hero.tag.from": "From",

  "section.shopByCategory": "Shop by category",
  "section.browseAll": "Browse all",
  "section.trending": "Trending now",
  "section.newArrivals": "New arrivals",
  "section.recommended": "Recommended for you",
  "section.recommendedSub": "Picked from your interests, {name}.",
  "section.viewAll": "View all →",

  "why.sustainable": "Sustainable",
  "why.sustainableSub":
    "Every purchase gives clothes a second life and keeps them out of landfill.",
  "why.unique": "Unique finds",
  "why.uniqueSub": "One-of-a-kind pieces you won't see anywhere else.",
  "why.local": "Support local",
  "why.localSub":
    "Buy directly from independent second-hand shops in Georgia.",

  "cta.title": "Are you a second-hand shop?",
  "cta.subtitle":
    "List your items on {site}, reach more customers, and manage your orders from one simple dashboard.",
  "cta.button": "Create your shop account",

  "product.addToCart": "Add to cart",
  "product.added": "Added ✓",
  "product.soldOut": "Sold out",
  "product.sold": "Sold",
  "product.size": "Size {size}",
  "product.oneSize": "One size",
  "product.wishlistAdd": "Add to wishlist",
  "product.wishlistRemove": "Remove from wishlist",

  "shop.title": "Shop pre-loved clothes",
  "shop.subtitle":
    "Quality-checked pieces from trusted local second-hand shops.",
  "shop.found": "Found {count} item(s)",
  "shop.loading": "Loading…",
  "shop.empty": "No products match your filters. Try clearing some filters.",

  "filter.title": "Filters",
  "filter.category": "Category",
  "filter.size": "Size",
  "filter.condition": "Condition",
  "filter.sort": "Sort",
  "filter.allCategories": "All categories",
  "filter.allSizes": "All sizes",
  "filter.allConditions": "All conditions",
  "filter.sortNewest": "Newest first",
  "filter.sortPriceAsc": "Price: low to high",
  "filter.sortPriceDesc": "Price: high to low",
  "filter.clear": "Clear filters",
  "filter.search": "Search",
  "filter.minPrice": "Min price",
  "filter.maxPrice": "Max price",
  "filter.price": "Price",
  "filter.searchPlaceholder": "Search clothes, brands…",

  "detail.back": "← Back to shop",
  "detail.loading": "Loading…",
  "detail.condition": "Condition",
  "detail.category": "Category",
  "detail.size": "Size",
  "detail.brand": "Brand",
  "detail.shop": "Shop",
  "detail.unbranded": "Unbranded",
  "detail.unknownShop": "Unknown",
  "detail.moreLikeThis": "More like this",
  "detail.defaultDescription": "This pre-loved piece is ready for a new home.",

  "cart.title": "Your cart",
  "cart.empty": "Your cart is empty",
  "cart.emptySub":
    "Browse our pre-loved collection and find something you love.",
  "cart.startShopping": "Start shopping",
  "cart.remove": "Remove",
  "cart.decrease": "Decrease quantity",
  "cart.increase": "Increase quantity",
  "cart.shippingNote": "Shipping is arranged by the seller after your order.",
  "cart.total": "Total",
  "cart.checkout": "Proceed to checkout",

  "checkout.title": "Checkout",
  "checkout.empty": "Your cart is empty",
  "checkout.browse": "Browse products",
  "checkout.contact": "Contact & delivery details",
  "checkout.name": "Full name *",
  "checkout.email": "Email *",
  "checkout.phone": "Phone *",
  "checkout.address": "Address *",
  "checkout.city": "City",
  "checkout.postal": "Postal code",
  "checkout.notes": "Notes for the seller (optional)",
  "checkout.placeOrder": "Place order",
  "checkout.placing": "Placing order…",
  "checkout.summary": "Order summary",
  "checkout.qty": "Qty {qty}",

  "auth.welcomeBack": "Welcome back",
  "auth.signInSub": "Sign in to your customer account.",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.fullName": "Full name",
  "auth.signIn": "Sign in",
  "auth.signingIn": "Signing in…",
  "auth.newHere": "New here?",
  "auth.createAccount": "Create an account",
  "auth.sellerPrompt": "Are you a shop owner?",
  "auth.sellerSignIn": "Seller sign in",
  "auth.createAccountTitle": "Create your account",
  "auth.createAccountSub": "Save your wishlist and track your orders.",
  "auth.createAccountBtn": "Create account",
  "auth.creatingAccount": "Creating account…",
  "auth.alreadyHave": "Already have an account?",
  "auth.sellingClothes": "Selling clothes?",
  "auth.createShopAccount": "Create a shop account",
  "auth.sellerSignInTitle": "Seller sign in",
  "auth.sellerSignInSub": "Manage your shop, products and orders.",
  "auth.createShopTitle": "Create your shop",
  "auth.createShopSub": "Start selling your pre-loved clothes in minutes.",
  "auth.shopName": "Shop name",
  "auth.shopNamePlaceholder": "e.g. Vintage Vibes Thrift",
  "auth.newShop": "New shop?",
  "auth.alreadyHaveShop": "Already have a shop?",
  "auth.demoBuyer": "Demo buyer: buyer@example.com / buyer1234",
  "auth.demoShop": "Demo shop: demo@thrift-shop.com / demo1234",

  "order.thankYou": "Thank you for your order!",
  "order.placed": "Your order has been placed successfully.",
  "order.totalPaid": "Total paid",
  "order.willConfirm":
    "The seller will review and confirm your order shortly. You will receive updates by email.",
  "order.continue": "Continue shopping",

  "account.hi": "Hi, {name}",
  "account.forYou": "For you",
  "account.orders": "Orders",
  "account.wishlist": "Wishlist",
  "account.noRecommendations":
    "Browse a few products and we'll start learning what you love.",
  "account.noOrders": "You have no orders yet.",
  "account.emptyWishlist":
    "Your wishlist is empty. Tap the heart on any product to save it here.",
  "account.order": "Order #{id}",

  "footer.tagline":
    "Shop sustainably and give quality clothes a second life.",
  "footer.shop": "Shop",
  "footer.allProducts": "All products",
  "footer.becomeSeller": "Become a seller",
  "footer.sellerLogin": "Seller login",
  "footer.categories": "Categories",
  "footer.rights": "All rights reserved.",
  "footer.serving": "Serving",

  "common.search": "Search",
  "common.loading": "Loading…",
};

export const dictionaries: Record<Language, Record<TranslationKey, string>> = {
  ka,
  en,
};

export function translateCategory(lang: Language, value: string): string {
  return lang === "ka" ? CATEGORY_LABELS_KA[value] ?? value : value;
}

export function translateCondition(lang: Language, value: string): string {
  return lang === "ka" ? CONDITION_LABELS_KA[value] ?? value : value;
}
