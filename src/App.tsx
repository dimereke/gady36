const TOKEN = "8990115812:AAEWfikTGX4lFVsJcitKYQLXTcDjY11Swv4";
const CHAT_ID = "2119077266";

import React, { useState, useEffect, useMemo } from "react";
import {
  ShoppingBag,
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Search,
  SlidersHorizontal,
  Truck,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";

type PageView = "catalog" | "product" | "cart" | "checkout" | "thank-you";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  dimensions: string;
  material: string;
  origin: string;
  inStock: boolean;
  sku: string;
  variants?: string[];
}

interface CartItem {
  productId: string;
  variant: string;
  quantity: number;
}

interface OrderReceipt {
  orderNumber: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    comment: string;
  };
  items: {
    product: Product;
    variant: string;
    quantity: number;
  }[];
  total: number;
}

const HERO_IMAGE = "/src/assets/images/hero_minimal_storefront_1793255058308.jpg";
const IMG_VASE = "/src/assets/images/product_ceramic_vase_1793255055660.jpg";
const IMG_LINEN = "/src/assets/images/product_linen_throw_1793255055167.jpg";
const IMG_LAMP = "/src/assets/images/product_brass_lamp_1793255057869.jpg";
const IMG_DIFFUSER = "/src/assets/images/product_aroma_diffuser_1793255057675.jpg";

const PRODUCTS: Product[] = [
  {
    id: "vase-stoneware-01",
    name: "Скульптурная ваза «Kanso» из шамотной глины",
    category: "Керамика",
    price: 28500,
    oldPrice: 34000,
    image: IMG_VASE,
    gallery: [IMG_VASE, HERO_IMAGE],
    shortDescription: "Ручная лепка, матовая глазурь оттенка известняка и органичный силуэт.",
    description:
      "Каждая ваза «Kanso» формуется вручную керамистами из высокотемпературной шамотной глины. Пористая каменная фактура и мягкий молочно-песочный оттенок создают выразительный акцент в интерьере как с сухоцветами, так и в качестве самостоятельной скульптуры. Внутренняя поверхность покрыта водостойкой глазурью.",
    dimensions: "26 × 18 × 16 см",
    material: "Шамотная каменная керамика, матовая глазурь",
    origin: "Ручная работа, малая серия",
    inStock: true,
    sku: "AH-CER-104",
    variants: ["Молочный травертин", "Теплый песок"],
  },
  {
    id: "lamp-alabaster-02",
    name: "Беспроводная настольная лампа «Lumière» из латуни и алебастра",
    category: "Освещение",
    price: 64900,
    image: IMG_LAMP,
    gallery: [IMG_LAMP, HERO_IMAGE],
    shortDescription: "Плафон из натурального испанского алебастра и корпус из брашированной латуни.",
    description:
      "Портативный светильник «Lumière» сочетает массивную базу из сатинированной латуни и купол, выточенный из цельного камня алебастра. При включении камень мягко рассеивает тёплый свет (2700K), подчеркивая уникальный природный рисунок прожилок. Сенсорный диммер поддерживает 3 уровня яркости и до 18 часов работы без подзарядки.",
    dimensions: "29 × 20 × 20 см",
    material: "Натуральный алебастр, брашированная латунь",
    origin: "Дизайнерская коллекция",
    inStock: true,
    sku: "AH-LGT-208",
    variants: ["Брашированная латунь", "Темная бронза"],
  },
  {
    id: "linen-set-03",
    name: "Плед и декоративная наволочка «Oatmeal» из бельгийского льна",
    category: "Текстиль",
    price: 42000,
    oldPrice: 48500,
    image: IMG_LINEN,
    gallery: [IMG_LINEN, HERO_IMAGE],
    shortDescription: "Органический умягченный лён плотностью 260 г/м² натурального овсяного оттенка.",
    description:
      "Комплект из объемного пледа и подушки выполнен из 100% длинноволокнистого бельгийского льна, прошедшего деликатную стирку с энзимами (stonewashed) для тактильной мягкости. Природная терморегуляция материала дарит прохладу летом и уютное тепло зимой, не требуя глажки.",
    dimensions: "Плед 150 × 220 см · Подушка 50 × 50 см",
    material: "100% органический бельгийский лён (OEKO-TEX)",
    origin: "Бельгия / Казахстан",
    inStock: true,
    sku: "AH-TXT-312",
    variants: ["Овсяный меланж", "Небеленый лен"],
  },
  {
    id: "diffuser-amber-04",
    name: "Аромадиффузор «Bergamot & Oud N°12» с эфирным маслом",
    category: "Ароматы",
    price: 21500,
    image: IMG_DIFFUSER,
    gallery: [IMG_DIFFUSER, HERO_IMAGE],
    shortDescription: "Аптекарское янтарное стекло, ротанговые палочки и концентрат для обновления.",
    description:
      "Сложная нишевая композиция для дома на базе натуральных ботанических масел. Верхние ноты калабрийского бергамота и белого кардамона плавно раскрываются теплым аккордом кедра, сухой амбры и благородного уда. В комплект входит флакон-рефилл 10 мл с пипеткой для усиления звучания аромата.",
    dimensions: "200 мл + 10 мл концентрат",
    material: "Янтарное стекло, натуральные эфирные масла, фибровые палочки",
    origin: "Грасс / Алматы",
    inStock: true,
    sku: "AH-ARO-419",
    variants: ["N°12 Бергамот и Уд", "N°08 Инжир и Ветивер"],
  },
  {
    id: "vessel-travertine-05",
    name: "Керамический сет «Atelier» из рифленой вазы и чаши",
    category: "Керамика",
    price: 36900,
    image: HERO_IMAGE,
    gallery: [HERO_IMAGE, IMG_VASE],
    shortDescription: "Архитектурный дуэт с вертикальным каннелюрным рельефом и матовой чашей.",
    description:
      "Эксклюзивный сет из двух предметов ручной работы: высокой цилиндрической вазы с тонкими архитектурными гранями и асимметричной глубокой чаши. Идеально подходит для сервировки обеденного стола, консоли в гостиной или оформления каменной столешницы.",
    dimensions: "Ваза 28 × 12 см · Чаша 11 × 17 см",
    material: "Фарфоровая масса, шелковисто-матовая глазурь",
    origin: "Лимитированная серия",
    inStock: true,
    sku: "AH-CER-502",
    variants: ["Теплый алебастр", "Каменный серый"],
  },
  {
    id: "candle-botanical-06",
    name: "Подарочный арома-бокс «Santal & Amber»",
    category: "Ароматы",
    price: 29800,
    oldPrice: 33500,
    image: IMG_DIFFUSER,
    gallery: [IMG_DIFFUSER, IMG_LINEN],
    shortDescription: "Диффузор повышенной стойкости и парфюмированный концентрат для текстиля.",
    description:
      "Создан для ценителей обволакивающих древесных ароматов. Набор включает диффузор объемом 250 мл в тяжелом аптекарском стекле и концентрированное масло сандала, пачули и теплой амбры. Стойкость ароматизации помещения до 16 недель.",
    dimensions: "250 мл + 15 мл масло",
    material: "Ботаническая база без фталатов, хлопковый мешочек",
    origin: "Ручной розлив",
    inStock: true,
    sku: "AH-ARO-605",
    variants: ["Сандал и Амбра", "Белый Кедр и Мох"],
  },
];

const CATEGORIES = ["Все товары", "Керамика", "Освещение", "Текстиль", "Ароматы"];

const CART_STORAGE_KEY = "aura_home_cart_v1";

function formatPrice(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₸";
}

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
}

function SafeImage({ src, alt, className = "" }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EFECE6] text-[#71717A] p-6 text-center ${className}`}
      >
        <Sparkles className="w-6 h-6 mb-2 opacity-60" />
        <span className="text-xs font-medium line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}

export default function App() {
  const [page, setPage] = useState<PageView>("catalog");
  const [selectedProductId, setSelectedProductId] = useState<string>(PRODUCTS[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>("Все товары");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  // Cart state persisted in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return [
      {
        productId: PRODUCTS[0].id,
        variant: PRODUCTS[0].variants?.[0] || "Стандарт",
        quantity: 1,
      },
    ];
  });

  // Product detail page state
  const [activeGalleryIdx, setActiveGalleryIdx] = useState<number>(0);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Checkout form state
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerAddress, setCustomerAddress] = useState<string>("");
  const [customerComment, setCustomerComment] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const [telegramError, setTelegramError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastOrder, setLastOrder] = useState<OrderReceipt | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage errors
    }
  }, [cart]);

  const selectedProduct = useMemo(
    () => PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0],
    [selectedProductId]
  );

  useEffect(() => {
    setActiveGalleryIdx(0);
    setSelectedVariant(selectedProduct.variants?.[0] || "Стандарт");
  }, [selectedProduct]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCat =
        selectedCategory === "Все товары" || product.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.shortDescription.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const cartDetailed = useMemo(() => {
    return cart
      .map((item) => {
        const product = PRODUCTS.find((p) => p.id === item.productId);
        if (!product) return null;
        return {
          ...item,
          product,
          subtotal: product.price * item.quantity,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [cart]);

  const cartTotalCount = useMemo(
    () => cartDetailed.reduce((acc, item) => acc + item.quantity, 0),
    [cartDetailed]
  );

  const cartTotalSum = useMemo(
    () => cartDetailed.reduce((acc, item) => acc + item.subtotal, 0),
    [cartDetailed]
  );

  const showToast = (text: string) => {
    setAddedToast(text);
    window.setTimeout(() => {
      setAddedToast((prev) => (prev === text ? null : prev));
    }, 2400);
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setPage("product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = (product: Product, variant?: string, qty = 1) => {
    const chosenVariant = variant || product.variants?.[0] || "Стандарт";
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.variant === chosenVariant
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
        };
        return updated;
      }
      return [...prev, { productId: product.id, variant: chosenVariant, quantity: qty }];
    });
    showToast(`Добавлено в корзину: ${product.name}`);
  };

  const handleUpdateQuantity = (productId: string, variant: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId && item.variant === variant) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((x): x is CartItem => x !== null)
    );
  };

  const handleRemoveFromCart = (productId: string, variant: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.variant === variant))
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const navigateTo = (target: PageView, categoryFilter?: string) => {
    if (categoryFilter) {
      setSelectedCategory(categoryFilter);
    }
    setFormError(null);
    setTelegramError(null);
    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setTelegramError(null);

    const trimmedName = customerName.trim();
    const trimmedPhone = customerPhone.trim();
    const trimmedAddress = customerAddress.trim();
    const trimmedComment = customerComment.trim();

    if (!trimmedName || !trimmedPhone) {
      setFormError("Пожалуйста, заполните обязательные поля: Имя и Телефон.");
      return;
    }

    if (cartDetailed.length === 0) {
      setFormError("Ваша корзина пуста. Добавьте товары перед оформлением заказа.");
      return;
    }

    const now = new Date();
    const formattedDateTime = now.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const itemsLines = cartDetailed
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.product.name} (${item.variant}) — ${item.quantity} шт. × ${formatPrice(
            item.product.price
          )} = ${formatPrice(item.subtotal)}`
      )
      .join("\n");

    const message = [
      "🛒 Новый заказ",
      "",
      "Состав заказа:",
      itemsLines,
      "",
      `Итого: ${formatPrice(cartTotalSum)}`,
      "",
      `Имя: ${trimmedName}`,
      `Телефон: ${trimmedPhone}`,
      `Адрес: ${trimmedAddress || "Не указан"}`,
      `Комментарий: ${trimmedComment || "Без комментария"}`,
      `Дата и время: ${formattedDateTime}`,
    ].join("\n");

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://api.telegram.org/bot" + TOKEN + "/sendMessage",
        {
          method: "POST",
          body: new URLSearchParams({
            chat_id: CHAT_ID,
            text: message,
          }),
        }
      );

      const data = await response.json();

      if (data && data.ok === true) {
        const orderReceipt: OrderReceipt = {
          orderNumber: `AH-${Math.floor(100000 + Math.random() * 900000)}`,
          createdAt: formattedDateTime,
          customer: {
            name: trimmedName,
            phone: trimmedPhone,
            address: trimmedAddress || "Не указан",
            comment: trimmedComment || "Без комментария",
          },
          items: cartDetailed.map((i) => ({
            product: i.product,
            variant: i.variant,
            quantity: i.quantity,
          })),
          total: cartTotalSum,
        };

        setLastOrder(orderReceipt);
        setCart([]);
        localStorage.removeItem(CART_STORAGE_KEY);
        setCustomerName("");
        setCustomerPhone("");
        setCustomerAddress("");
        setCustomerComment("");
        setPage("thank-you");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setTelegramError(
          data?.description
            ? `Ошибка отправки заказа в Telegram: ${data.description}`
            : "Не удалось отправить заказ в Telegram. Пожалуйста, проверьте соединение и попробуйте снова."
        );
      }
    } catch {
      setTelegramError(
        "Ошибка сети при отправке заказа в Telegram. Пожалуйста, попробуйте ещё раз."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#18181B] pb-20 md:pb-0">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E5E0D8]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-14 md:h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => navigateTo("catalog", "Все товары")}
            className="text-xl md:text-2xl font-bold tracking-tight text-[#18181B] font-serif-display whitespace-nowrap shrink-0 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18181B]"
          >
            AURA HOME
          </button>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#52525B]">
            <button
              type="button"
              onClick={() => navigateTo("catalog", "Все товары")}
              className={`hover:text-[#18181B] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 border-b-2 ${
                page === "catalog" && selectedCategory === "Все товары"
                  ? "border-[#18181B] text-[#18181B]"
                  : "border-transparent"
              }`}
            >
              Каталог
            </button>
            <button
              type="button"
              onClick={() => navigateTo("catalog", "Керамика")}
              className={`hover:text-[#18181B] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 border-b-2 ${
                page === "catalog" && selectedCategory === "Керамика"
                  ? "border-[#18181B] text-[#18181B]"
                  : "border-transparent"
              }`}
            >
              Керамика
            </button>
            <button
              type="button"
              onClick={() => navigateTo("catalog", "Освещение")}
              className={`hover:text-[#18181B] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 border-b-2 ${
                page === "catalog" && selectedCategory === "Освещение"
                  ? "border-[#18181B] text-[#18181B]"
                  : "border-transparent"
              }`}
            >
              Освещение
            </button>
            <button
              type="button"
              onClick={() => navigateTo("catalog", "Текстиль")}
              className={`hover:text-[#18181B] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 border-b-2 ${
                page === "catalog" && selectedCategory === "Текстиль"
                  ? "border-[#18181B] text-[#18181B]"
                  : "border-transparent"
              }`}
            >
              Текстиль
            </button>
            <button
              type="button"
              onClick={() => navigateTo("catalog", "Ароматы")}
              className={`hover:text-[#18181B] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 border-b-2 ${
                page === "catalog" && selectedCategory === "Ароматы"
                  ? "border-[#18181B] text-[#18181B]"
                  : "border-transparent"
              }`}
            >
              Ароматы
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => navigateTo("cart")}
              className="min-h-[44px] px-4 py-2 text-xs sm:text-sm font-medium text-[#FAF8F5] bg-[#18181B] rounded-xl hover:bg-[#27272A] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Корзина</span>
              <span className="font-mono tabular-nums">({cartTotalCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Subtle Toast Notification */}
      {addedToast && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-[#18181B] text-[#FAF8F5] px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 text-sm transition-opacity">
          <CheckCircle2 className="w-4 h-4 text-[#D4A373] shrink-0" />
          <span className="truncate">{addedToast}</span>
          <button
            type="button"
            onClick={() => navigateTo("cart")}
            className="ml-auto text-xs underline underline-offset-2 text-[#D4A373] whitespace-nowrap shrink-0 cursor-pointer"
          >
            В корзину
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* ==================== PAGE 1: CATALOG ==================== */}
        {page === "catalog" && (
          <div>
            {/* Section 1: Storefront Hero */}
            <section className="border-b border-[#E5E0D8]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                  <div className="lg:col-span-5 flex flex-col justify-between py-2">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#71717A] mb-4">
                        <span>Коллекция Осень–Зима</span>
                        <span aria-hidden="true">·</span>
                        <span>Доставка по всему Казахстану</span>
                      </div>
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#18181B] leading-[1.12] mb-4">
                        Тактильная эстетика и тишина природного камня в вашем доме
                      </h1>
                      <p className="text-sm sm:text-base text-[#52525B] leading-relaxed mb-6">
                        Предметы интерьера ручной работы: керамика из шамотной глины, светильники из натурального алебастра, бельгийский лён и нишевые ароматы для дома.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            const el = document.getElementById("catalog-grid");
                            el?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="min-h-[48px] px-6 py-3 bg-[#18181B] text-[#FAF8F5] text-sm font-medium rounded-xl hover:bg-[#27272A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Смотреть коллекцию
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenProduct(PRODUCTS[1])}
                          className="min-h-[48px] px-5 py-3 border border-[#D6D1C7] text-[#18181B] text-sm font-medium rounded-xl hover:bg-[#EFECE6] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Лампа «Lumière» — 64 900 ₸
                        </button>
                      </div>

                      <div className="pt-4 border-t border-[#E5E0D8] grid grid-cols-3 gap-4 text-xs text-[#52525B]">
                        <div>
                          <div className="font-semibold text-[#18181B] font-mono tabular-nums">
                            от 35 000 ₸
                          </div>
                          <div>Бесплатная доставка</div>
                        </div>
                        <div>
                          <div className="font-semibold text-[#18181B] font-mono tabular-nums">
                            1–3 дня
                          </div>
                          <div>Алматы и Астана</div>
                        </div>
                        <div>
                          <div className="font-semibold text-[#18181B] font-mono tabular-nums">
                            100%
                          </div>
                          <div>Природные материалы</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7">
                    <div
                      onClick={() => handleOpenProduct(PRODUCTS[4])}
                      className="group relative h-64 sm:h-80 lg:h-full min-h-[280px] rounded-2xl overflow-hidden border border-[#E5E0D8] cursor-pointer"
                    >
                      <SafeImage
                        src={HERO_IMAGE}
                        alt="Интерьерная коллекция AURA HOME на травертине"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex items-end p-5 sm:p-7">
                        <div className="text-white max-w-md">
                          <div className="text-xs text-white/80 mb-1">
                            Выбор редакции · Лимитированная серия
                          </div>
                          <div className="text-lg sm:text-xl font-medium font-serif-display">
                            Керамический сет «Atelier» из рифленой вазы и чаши
                          </div>
                          <div className="mt-1 text-sm font-mono tabular-nums text-white/95">
                            36 900 ₸
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Catalog Filter Bar & Product Grid */}
            <section id="catalog-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#18181B]">
                    Каталог предметов
                  </h2>
                  <p className="text-xs sm:text-sm text-[#71717A] mt-1">
                    Показано товаров: <span className="font-mono tabular-nums">{filteredProducts.length}</span> · Цены указаны в тенге (₸)
                  </p>
                </div>

                {/* Search & Sort Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Поиск по названию..."
                      className="w-full min-h-[44px] pl-10 pr-4 py-2 text-sm bg-white border border-[#E5E0D8] rounded-xl text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#18181B]"
                    />
                  </div>

                  <div className="relative flex items-center">
                    <SlidersHorizontal className="w-4 h-4 text-[#71717A] absolute left-3.5 pointer-events-none" />
                    <select
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(e.target.value as "featured" | "price-asc" | "price-desc")
                      }
                      aria-label="Сортировка товаров"
                      className="min-h-[44px] pl-10 pr-8 py-2 text-sm bg-white border border-[#E5E0D8] rounded-xl text-[#18181B] focus:outline-none focus:border-[#18181B] cursor-pointer"
                    >
                      <option value="featured">По популярности</option>
                      <option value="price-asc">Сначала дешевле</option>
                      <option value="price-desc">Сначала дороже</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Interactive Category Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1.5 bg-[#EFECE6] rounded-xl overflow-x-auto mb-8">
                {CATEGORIES.map((category) => {
                  const active = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`min-h-[40px] px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? "bg-white text-[#18181B] shadow-xs"
                          : "text-[#52525B] hover:text-[#18181B]"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {/* Product Grid: 3-column desktop, 2-column tablet, 1-column mobile */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white border border-[#E5E0D8] rounded-2xl p-10 text-center">
                  <p className="text-base font-medium text-[#18181B] mb-2">
                    По вашему запросу ничего не найдено
                  </p>
                  <p className="text-sm text-[#71717A] mb-6">
                    Попробуйте изменить поисковый запрос или сбросить фильтр категорий.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("Все товары");
                      setSearchQuery("");
                    }}
                    className="min-h-[44px] px-5 py-2.5 bg-[#18181B] text-[#FAF8F5] text-sm font-medium rounded-xl hover:bg-[#27272A] transition-colors cursor-pointer"
                  >
                    Показать все товары
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredProducts.map((product) => {
                    const inCartQty = cart
                      .filter((i) => i.productId === product.id)
                      .reduce((sum, i) => sum + i.quantity, 0);

                    return (
                      <article
                        key={product.id}
                        className="group bg-white border border-[#E5E0D8] rounded-2xl overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5"
                      >
                        <div
                          onClick={() => handleOpenProduct(product)}
                          className="aspect-[4/3] w-full bg-[#EFECE6] overflow-hidden cursor-pointer relative"
                        >
                          <SafeImage
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                          />
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            {/* Clean unboxed metadata with typographic separator */}
                            <div className="flex items-center gap-2 text-xs text-[#71717A] mb-1.5">
                              <span>{product.category}</span>
                              <span aria-hidden="true">·</span>
                              <span>В наличии</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono">{product.sku}</span>
                            </div>

                            <h3
                              onClick={() => handleOpenProduct(product)}
                              className="text-base font-semibold text-[#18181B] group-hover:text-[#52525B] transition-colors cursor-pointer line-clamp-2 mb-2"
                            >
                              {product.name}
                            </h3>

                            <p className="text-xs sm:text-sm text-[#52525B] line-clamp-2 mb-4">
                              {product.shortDescription}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-[#F4F1EA] flex items-center justify-between gap-3">
                            <div>
                              <div className="text-base sm:text-lg font-semibold text-[#18181B] font-mono tabular-nums">
                                {formatPrice(product.price)}
                              </div>
                              {product.oldPrice && (
                                <div className="text-xs text-[#A1A1AA] line-through font-mono tabular-nums">
                                  {formatPrice(product.oldPrice)}
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddToCart(product)}
                              className="min-h-[44px] px-4 py-2 bg-[#18181B] text-[#FAF8F5] text-xs sm:text-sm font-medium rounded-xl hover:bg-[#27272A] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
                            >
                              <Plus className="w-4 h-4" />
                              <span>
                                {inCartQty > 0 ? `В корзине (${inCartQty})` : "В корзину"}
                              </span>
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Section 3: Craftsmanship & Delivery Trust */}
            <section className="border-t border-[#E5E0D8] bg-[#F4F1EA]/70">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6">
                    <Truck className="w-5 h-5 text-[#18181B] mb-3" />
                    <h3 className="text-base font-semibold text-[#18181B] mb-1.5">
                      Бережная доставка по Казахстану
                    </h3>
                    <p className="text-sm text-[#52525B] leading-relaxed">
                      Курьерская доставка до двери в Алматы и Астане за 1–2 дня. Надежная многослойная упаковка для хрупкой керамики и камня.
                    </p>
                  </div>

                  <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6">
                    <ShieldCheck className="w-5 h-5 text-[#18181B] mb-3" />
                    <h3 className="text-base font-semibold text-[#18181B] mb-1.5">
                      Оплата при получении или по счету
                    </h3>
                    <p className="text-sm text-[#52525B] leading-relaxed">
                      Оформляйте заказ онлайн без предоплаты на сайте — менеджер свяжется с вами в Telegram или по телефону для подтверждения деталей.
                    </p>
                  </div>

                  <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6">
                    <Sparkles className="w-5 h-5 text-[#18181B] mb-3" />
                    <h3 className="text-base font-semibold text-[#18181B] mb-1.5">
                      Натуральные фактуры и материалы
                    </h3>
                    <p className="text-sm text-[#52525B] leading-relaxed">
                      Испанский алебастр, шамотная глина ручной формовки, бельгийский органический лён OEKO-TEX и чистые эфирные масла.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ==================== PAGE 2: PRODUCT DETAIL ==================== */}
        {page === "product" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
            {/* Breadcrumb & Back button */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <button
                type="button"
                onClick={() => navigateTo("catalog")}
                className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium text-[#52525B] hover:text-[#18181B] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Назад в каталог</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 text-xs text-[#71717A]">
                <span>Каталог</span>
                <span aria-hidden="true">/</span>
                <span>{selectedProduct.category}</span>
                <span aria-hidden="true">/</span>
                <span className="text-[#18181B] truncate max-w-[220px]">
                  {selectedProduct.name}
                </span>
              </div>
            </div>

            {/* Contiguous Purchase Module (PDP) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Product Gallery */}
              <div className="lg:col-span-7 space-y-4">
                <div className="aspect-[4/3] w-full bg-[#EFECE6] border border-[#E5E0D8] rounded-2xl overflow-hidden">
                  <SafeImage
                    src={
                      selectedProduct.gallery[activeGalleryIdx] || selectedProduct.image
                    }
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {selectedProduct.gallery.length > 1 && (
                  <div className="flex items-center gap-3">
                    {selectedProduct.gallery.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveGalleryIdx(idx)}
                        className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          activeGalleryIdx === idx
                            ? "border-[#18181B]"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <SafeImage
                          src={imgUrl}
                          alt={`${selectedProduct.name} — фото ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Sticky Purchase Module */}
              <div className="lg:col-span-5 bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-2 text-xs text-[#71717A] mb-2">
                  <span>{selectedProduct.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>Артикул {selectedProduct.sku}</span>
                  <span aria-hidden="true">·</span>
                  <span>В наличии</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-semibold text-[#18181B] leading-tight mb-4">
                  {selectedProduct.name}
                </h1>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-2xl sm:text-3xl font-semibold text-[#18181B] font-mono tabular-nums">
                    {formatPrice(selectedProduct.price)}
                  </span>
                  {selectedProduct.oldPrice && (
                    <span className="text-sm text-[#A1A1AA] line-through font-mono tabular-nums">
                      {formatPrice(selectedProduct.oldPrice)}
                    </span>
                  )}
                </div>

                <p className="text-sm sm:text-base text-[#52525B] leading-relaxed mb-6">
                  {selectedProduct.description}
                </p>

                {/* Variant Selector */}
                {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                  <div className="mb-6">
                    <div className="text-xs font-medium text-[#52525B] mb-2">
                      Оттенок / исполнение:{" "}
                      <span className="text-[#18181B] font-semibold">{selectedVariant}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.variants.map((variant) => {
                        const isSelected = selectedVariant === variant;
                        return (
                          <button
                            key={variant}
                            type="button"
                            onClick={() => setSelectedVariant(variant)}
                            className={`min-h-[44px] px-4 py-2 text-xs sm:text-sm font-medium rounded-xl border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                              isSelected
                                ? "border-[#18181B] bg-[#18181B] text-[#FAF8F5]"
                                : "border-[#E5E0D8] bg-[#FAF8F5] text-[#18181B] hover:bg-[#EFECE6]"
                            }`}
                          >
                            {variant}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Primary Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(selectedProduct, selectedVariant, 1)}
                    className="flex-1 min-h-[48px] px-6 py-3 bg-[#18181B] text-[#FAF8F5] text-sm font-medium rounded-xl hover:bg-[#27272A] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Добавить в корзину</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(selectedProduct, selectedVariant, 1);
                      navigateTo("checkout");
                    }}
                    className="min-h-[48px] px-5 py-3 border border-[#18181B] text-[#18181B] text-sm font-medium rounded-xl hover:bg-[#EFECE6] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Купить сейчас
                  </button>
                </div>

                {/* Specifications Table */}
                <div className="pt-6 border-t border-[#E5E0D8] space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between gap-4 py-1 border-b border-[#F4F1EA]">
                    <span className="text-[#71717A]">Размеры / Объем</span>
                    <span className="text-[#18181B] font-medium text-right font-mono tabular-nums">
                      {selectedProduct.dimensions}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 py-1 border-b border-[#F4F1EA]">
                    <span className="text-[#71717A]">Материалы</span>
                    <span className="text-[#18181B] font-medium text-right">
                      {selectedProduct.material}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 py-1">
                    <span className="text-[#71717A]">Производство</span>
                    <span className="text-[#18181B] font-medium text-right">
                      {selectedProduct.origin}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Products */}
            <div className="mt-14 pt-10 border-t border-[#E5E0D8]">
              <h2 className="text-2xl font-semibold text-[#18181B] mb-6">
                Дополните интерьер
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {PRODUCTS.filter((p) => p.id !== selectedProduct.id)
                  .slice(0, 3)
                  .map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => handleOpenProduct(rel)}
                      className="bg-white border border-[#E5E0D8] rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-[#18181B] transition-colors"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#EFECE6] shrink-0">
                        <SafeImage
                          src={rel.image}
                          alt={rel.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-[#71717A] mb-0.5">{rel.category}</div>
                        <div className="text-sm font-semibold text-[#18181B] truncate">
                          {rel.name}
                        </div>
                        <div className="text-sm font-mono tabular-nums text-[#52525B] mt-1">
                          {formatPrice(rel.price)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== PAGE 3: CART ==================== */}
        {page === "cart" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-[#18181B]">
                  Корзина
                </h1>
                <p className="text-xs sm:text-sm text-[#71717A] mt-1">
                  Товаров в корзине:{" "}
                  <span className="font-mono tabular-nums">{cartTotalCount}</span> · Данные автоматически сохраняются
                </p>
              </div>

              {cartDetailed.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="min-h-[44px] px-3 py-2 text-xs sm:text-sm text-[#71717A] hover:text-red-700 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Очистить корзину</span>
                </button>
              )}
            </div>

            {cartDetailed.length === 0 ? (
              <div className="bg-white border border-[#E5E0D8] rounded-2xl p-10 sm:p-14 text-center">
                <ShoppingBag className="w-10 h-10 text-[#A1A1AA] mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-[#18181B] mb-2">
                  Ваша корзина пока пуста
                </h2>
                <p className="text-sm text-[#71717A] max-w-md mx-auto mb-6">
                  Перейдите в каталог, чтобы выбрать керамику ручной работы, освещение, текстиль или ароматы для дома.
                </p>
                <button
                  type="button"
                  onClick={() => navigateTo("catalog")}
                  className="min-h-[48px] px-6 py-3 bg-[#18181B] text-[#FAF8F5] text-sm font-medium rounded-xl hover:bg-[#27272A] transition-colors cursor-pointer"
                >
                  Перейти в каталог
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Itemized Cart List */}
                <div className="lg:col-span-8 bg-white border border-[#E5E0D8] rounded-2xl divide-y divide-[#E5E0D8]">
                  {cartDetailed.map((item) => (
                    <div
                      key={`${item.productId}-${item.variant}`}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4"
                    >
                      <div
                        onClick={() => handleOpenProduct(item.product)}
                        className="w-24 h-20 rounded-xl overflow-hidden bg-[#EFECE6] shrink-0 cursor-pointer"
                      >
                        <SafeImage
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs text-[#71717A] mb-1">
                          <span>{item.product.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.variant}</span>
                        </div>
                        <h3
                          onClick={() => handleOpenProduct(item.product)}
                          className="text-sm sm:text-base font-semibold text-[#18181B] hover:underline cursor-pointer line-clamp-2"
                        >
                          {item.product.name}
                        </h3>
                        <div className="text-xs sm:text-sm text-[#52525B] font-mono tabular-nums mt-1">
                          {formatPrice(item.product.price)} за шт.
                        </div>
                      </div>

                      {/* Quantity Stepper & Subtotal */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F4F1EA]">
                        <div className="inline-flex items-center border border-[#E5E0D8] rounded-xl bg-[#FAF8F5]">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(item.productId, item.variant, -1)
                            }
                            aria-label="Уменьшить количество"
                            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#18181B] hover:bg-[#EFECE6] rounded-l-xl transition-colors cursor-pointer"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 text-sm font-semibold font-mono tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(item.productId, item.variant, 1)
                            }
                            aria-label="Увеличить количество"
                            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#18181B] hover:bg-[#EFECE6] rounded-r-xl transition-colors cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right min-w-[100px]">
                          <div className="text-sm sm:text-base font-semibold text-[#18181B] font-mono tabular-nums">
                            {formatPrice(item.subtotal)}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveFromCart(item.productId, item.variant)
                          }
                          aria-label="Удалить товар"
                          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#71717A] hover:text-red-700 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary Card */}
                <div className="lg:col-span-4 bg-white border border-[#E5E0D8] rounded-2xl p-6 space-y-5">
                  <h2 className="text-lg font-semibold text-[#18181B]">
                    Сумма заказа
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-[#52525B]">
                      <span>Товары ({cartTotalCount} шт.)</span>
                      <span className="font-mono tabular-nums">
                        {formatPrice(cartTotalSum)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#52525B]">
                      <span>Доставка</span>
                      <span className="font-mono tabular-nums text-[#18181B]">
                        {cartTotalSum >= 35000 ? "Бесплатно" : "По тарифам курьера"}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-[#E5E0D8] flex justify-between items-baseline">
                      <span className="text-base font-semibold text-[#18181B]">
                        Итого к оплате
                      </span>
                      <span className="text-xl font-bold text-[#18181B] font-mono tabular-nums">
                        {formatPrice(cartTotalSum)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateTo("checkout")}
                    className="w-full min-h-[48px] px-6 py-3 bg-[#18181B] text-[#FAF8F5] text-sm font-medium rounded-xl hover:bg-[#27272A] transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Перейти к оформлению</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo("catalog")}
                    className="w-full min-h-[44px] px-4 py-2.5 border border-[#E5E0D8] text-[#18181B] text-xs sm:text-sm font-medium rounded-xl hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    Продолжить покупки
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== PAGE 4: CHECKOUT ==================== */}
        {page === "checkout" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
            <button
              type="button"
              onClick={() => navigateTo("cart")}
              className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium text-[#52525B] hover:text-[#18181B] transition-colors mb-4 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Вернуться в корзину</span>
            </button>

            <h1 className="text-2xl sm:text-3xl font-semibold text-[#18181B] mb-2">
              Оформление заказа
            </h1>
            <p className="text-xs sm:text-sm text-[#71717A] mb-8">
              Заполните контактные данные. Заказ сразу поступит менеджеру в Telegram, оплата на сайте не требуется.
            </p>

            {cartDetailed.length === 0 ? (
              <div className="bg-white border border-[#E5E0D8] rounded-2xl p-10 text-center">
                <p className="text-base font-medium text-[#18181B] mb-4">
                  В корзине нет товаров для оформления заказа.
                </p>
                <button
                  type="button"
                  onClick={() => navigateTo("catalog")}
                  className="min-h-[48px] px-6 py-3 bg-[#18181B] text-[#FAF8F5] text-sm font-medium rounded-xl cursor-pointer"
                >
                  Вернуться в каталог
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Checkout Form */}
                <form
                  onSubmit={handleSubmitOrder}
                  noValidate
                  className="lg:col-span-7 bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-8 space-y-5"
                >
                  <h2 className="text-lg font-semibold text-[#18181B]">
                    Контактные данные получателя
                  </h2>

                  {formError && (
                    <div
                      role="alert"
                      className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {telegramError && (
                    <div
                      role="alert"
                      className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold mb-0.5">
                          Не удалось отправить заказ
                        </div>
                        <div>{telegramError}</div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="checkout-name"
                      className="block text-xs sm:text-sm font-medium text-[#18181B] mb-1.5"
                    >
                      Имя <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="checkout-name"
                      name="name"
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Например, Айгерим Смагулова"
                      className="w-full min-h-[48px] px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:bg-white focus:border-[#18181B]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-phone"
                      className="block text-xs sm:text-sm font-medium text-[#18181B] mb-1.5"
                    >
                      Телефон <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="checkout-phone"
                      name="phone"
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+7 (777) 000-00-00"
                      className="w-full min-h-[48px] px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:bg-white focus:border-[#18181B] font-mono tabular-nums"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-address"
                      className="block text-xs sm:text-sm font-medium text-[#18181B] mb-1.5"
                    >
                      Адрес доставки
                    </label>
                    <input
                      id="checkout-address"
                      name="address"
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Город, улица, дом, квартира"
                      className="w-full min-h-[48px] px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:bg-white focus:border-[#18181B]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-comment"
                      className="block text-xs sm:text-sm font-medium text-[#18181B] mb-1.5"
                    >
                      Комментарий к заказу
                    </label>
                    <textarea
                      id="checkout-comment"
                      name="comment"
                      rows={3}
                      value={customerComment}
                      onChange={(e) => setCustomerComment(e.target.value)}
                      placeholder="Код домофона, удобное время доставки или пожелания по упаковке"
                      className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:bg-white focus:border-[#18181B]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full min-h-[52px] px-6 py-3.5 bg-[#18181B] text-[#FAF8F5] text-sm sm:text-base font-medium rounded-xl hover:bg-[#27272A] disabled:opacity-60 transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>
                        {isSubmitting ? "Отправка заказа..." : "Оформить заказ"}
                      </span>
                    </button>
                    <p className="text-xs text-[#71717A] text-center mt-3">
                      Нажимая «Оформить заказ», вы отправляете заявку менеджеру магазина. Оплата производится после подтверждения.
                    </p>
                  </div>
                </form>

                {/* Order Items Recap */}
                <div className="lg:col-span-5 bg-white border border-[#E5E0D8] rounded-2xl p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[#18181B]">
                      Ваш заказ
                    </h2>
                    <button
                      type="button"
                      onClick={() => navigateTo("cart")}
                      className="text-xs font-medium text-[#52525B] hover:text-[#18181B] underline underline-offset-2 cursor-pointer"
                    >
                      Изменить
                    </button>
                  </div>

                  <div className="divide-y divide-[#F4F1EA] max-h-80 overflow-y-auto pr-1">
                    {cartDetailed.map((item) => (
                      <div
                        key={`${item.productId}-${item.variant}`}
                        className="py-3 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#EFECE6] shrink-0">
                            <SafeImage
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-medium text-[#18181B] truncate">
                              {item.product.name}
                            </div>
                            <div className="text-xs text-[#71717A] font-mono tabular-nums">
                              {item.variant} · {item.quantity} шт. ×{" "}
                              {formatPrice(item.product.price)}
                            </div>
                          </div>
                        </div>

                        <div className="text-xs sm:text-sm font-semibold text-[#18181B] font-mono tabular-nums shrink-0">
                          {formatPrice(item.subtotal)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#E5E0D8] space-y-2 text-sm">
                    <div className="flex justify-between text-[#52525B]">
                      <span>Количество позиций</span>
                      <span className="font-mono tabular-nums">{cartTotalCount} шт.</span>
                    </div>
                    <div className="flex justify-between text-[#52525B]">
                      <span>Способ оплаты</span>
                      <span>При получении / Kaspi счет</span>
                    </div>
                    <div className="pt-3 border-t border-[#F4F1EA] flex justify-between items-baseline">
                      <span className="text-base font-semibold text-[#18181B]">
                        Итого
                      </span>
                      <span className="text-xl font-bold text-[#18181B] font-mono tabular-nums">
                        {formatPrice(cartTotalSum)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== PAGE 5: THANK YOU ==================== */}
        {page === "thank-you" && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
            <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div className="flex items-center gap-2 text-xs text-[#71717A] mb-2">
                <span>Заказ подтвержден</span>
                {lastOrder && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{lastOrder.orderNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{lastOrder.createdAt}</span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-semibold text-[#18181B] mb-3">
                Спасибо за ваш заказ!
              </h1>
              <p className="text-sm sm:text-base text-[#52525B] leading-relaxed mb-8">
                Ваша заявка успешно отправлена в Telegram-бот магазина AURA HOME. Наш менеджер свяжется с вами в ближайшее время по указанному номеру телефона для согласования времени доставки.
              </p>

              {lastOrder && (
                <div className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl p-5 sm:p-6 mb-8 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm pb-4 border-b border-[#E5E0D8]">
                    <div>
                      <div className="text-[#71717A] mb-0.5">Получатель</div>
                      <div className="font-semibold text-[#18181B]">
                        {lastOrder.customer.name}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#71717A] mb-0.5">Телефон</div>
                      <div className="font-semibold text-[#18181B] font-mono tabular-nums">
                        {lastOrder.customer.phone}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#71717A] mb-0.5">Адрес доставки</div>
                      <div className="font-medium text-[#18181B]">
                        {lastOrder.customer.address}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#71717A] mb-0.5">Комментарий</div>
                      <div className="font-medium text-[#18181B]">
                        {lastOrder.customer.comment}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="text-xs font-semibold text-[#71717A]">
                      Состав заказа
                    </div>
                    {lastOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-4 text-xs sm:text-sm"
                      >
                        <span className="text-[#18181B]">
                          {item.product.name} ({item.variant}) × {item.quantity} шт.
                        </span>
                        <span className="font-mono tabular-nums font-medium text-[#18181B] shrink-0">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#E5E0D8] flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#18181B]">
                      Итого по заказу
                    </span>
                    <span className="text-lg font-bold text-[#18181B] font-mono tabular-nums">
                      {formatPrice(lastOrder.total)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigateTo("catalog", "Все товары")}
                  className="min-h-[48px] px-6 py-3 bg-[#18181B] text-[#FAF8F5] text-sm font-medium rounded-xl hover:bg-[#27272A] transition-colors cursor-pointer"
                >
                  Вернуться в каталог
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-[#E5E0D8] bg-[#FAF8F5] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[#E5E0D8] text-sm text-[#52525B]">
            <div>
              <div className="text-lg font-bold text-[#18181B] font-serif-display mb-2">
                AURA HOME
              </div>
              <p className="text-xs sm:text-sm text-[#71717A] max-w-xs leading-relaxed">
                Онлайн-бутик предметов интерьера, авторской керамики, освещения и домашнего текстиля в Казахстане.
              </p>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="font-semibold text-[#18181B]">Шоурум и доставка</div>
              <div className="flex items-center gap-2 text-[#52525B]">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>г. Алматы, пр. Аль-Фараби, 77/8</span>
              </div>
              <div className="flex items-center gap-2 text-[#52525B]">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Ежедневно с 10:00 до 21:00</span>
              </div>
              <div className="flex items-center gap-2 text-[#52525B] font-mono tabular-nums">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+7 (727) 355-40-90</span>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="font-semibold text-[#18181B]">Разделы магазина</div>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <button
                  type="button"
                  onClick={() => navigateTo("catalog", "Все товары")}
                  className="hover:text-[#18181B] cursor-pointer"
                >
                  Каталог
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo("cart")}
                  className="hover:text-[#18181B] cursor-pointer"
                >
                  Корзина ({cartTotalCount})
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo("checkout")}
                  className="hover:text-[#18181B] cursor-pointer"
                >
                  Оформление заказа
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#71717A]">
            <span>© 2026 AURA HOME Kazakhstan. Все права защищены.</span>
            <span>Все цены указаны в казахстанских тенге (₸)</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Tab Bar (Thumb-zone ergonomic navigation, < 15% viewport height with top bar) */}
      <nav
        aria-label="Мобильная навигация"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E5E0D8] grid grid-cols-3 items-center h-14 px-2"
      >
        <button
          type="button"
          onClick={() => navigateTo("catalog")}
          className={`min-h-[44px] flex flex-col items-center justify-center cursor-pointer ${
            page === "catalog" || page === "product"
              ? "text-[#18181B] font-semibold"
              : "text-[#71717A]"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[11px] mt-0.5 whitespace-nowrap">Каталог</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo("cart")}
          className={`min-h-[44px] flex flex-col items-center justify-center cursor-pointer ${
            page === "cart" ? "text-[#18181B] font-semibold" : "text-[#71717A]"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="text-[11px] mt-0.5 whitespace-nowrap font-mono tabular-nums">
            Корзина ({cartTotalCount})
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo("checkout")}
          className={`min-h-[44px] flex flex-col items-center justify-center cursor-pointer ${
            page === "checkout" ? "text-[#18181B] font-semibold" : "text-[#71717A]"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-[11px] mt-0.5 whitespace-nowrap">Оформить</span>
        </button>
      </nav>
    </div>
  );
}
