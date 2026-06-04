"use client";

import { useMemo, useState } from "react";
import products from "@/app/data/products";

export default function LandingPage() {
  const [search, setSearch] = useState("");
  const [selectedProductType, setSelectedProductType] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [showSmoke, setShowSmoke] = useState(false);
  const [showChromeline, setShowChromeline] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(0);

  const discountOptions = Array.from({ length: 11 }, (_, index) => 50 + index);

  const normalize = (value) => {
    return String(value || "")
      .toLowerCase()
      .replace(/[-_/()₹]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const compact = (value) => {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  };

  const splitBrands = (brandText) => {
    return String(brandText || "")
      .split("/")
      .map((brand) => brand.trim())
      .filter(Boolean);
  };

  const getCarName = (product) => {
    if (product.carName) return product.carName;
    if (Array.isArray(product.carModel)) return product.carModel.join(" / ");
    return product.name || "Car Model";
  };

  const getBrandName = (product) => {
    if (product.brandName) return product.brandName;
    if (Array.isArray(product.carBrand)) return product.carBrand.join(" / ");
    return product.carBrand || "Brand";
  };

  const getProductBrands = (product) => {
    return splitBrands(getBrandName(product));
  };

  const getProductType = (product) => {
    const text = [
      product.productType,
      product.productCategory,
      product.category,
      product.type,
      product.name,
      product.title,
    ]
      .join(" ")
      .toLowerCase();

    if (text.includes("parcel") || text.includes("tray")) {
      return "parcel-tray";
    }

    return "door-visor";
  };

  const getProductTypeLabel = (type) => {
    if (type === "parcel-tray") return "Parcel Tray";
    if (type === "door-visor") return "Door Visor";
    return "Product";
  };

  const getYear = (product) => {
    if (product.year) return product.year;

    const text = [
      product.name,
      ...(product.carModel || []),
      product.specifications?.fitment,
    ].join(" ");

    const years = text.match(/\b(19|20)\d{2}\b/g);

    if (years?.length) {
      return [...new Set(years)].join(" - ");
    }

    if (text.toLowerCase().includes("old")) return "Old Model";
    if (text.toLowerCase().includes("new")) return "New Model";

    return "All Years";
  };

  const getSetCount = (product) => {
    if (product.set) return `Set of ${product.set}`;
    if (product.specifications?.pieces) return product.specifications.pieces;
    if (product.variant) return product.variant;
    if (product.bracket) return product.bracket;
    return "Standard";
  };

  const getSmokePrice = (product) => {
    return product.smokePrice || product.price;
  };

  const getChromelinePrice = (product) => {
    if (product.chromelinePrice) return product.chromelinePrice;

    if (product.set === 2) return 800;
    if (product.set === 4) return 1025;
    if (product.set === 6) return 1500;

    return product.price;
  };

  const applyDiscount = (price) => {
    if (!selectedDiscount) return price;
    return Math.round(Number(price) - (Number(price) * selectedDiscount) / 100);
  };

  const formatPrice = (price) => {
    return `₹${applyDiscount(price)}`;
  };

  const formatOriginalPrice = (price) => {
    return `₹${price}`;
  };

  const getBasePriceText = (product) => {
    const type = getProductType(product);

    if (type === "parcel-tray") {
      return formatOriginalPrice(product.price);
    }

    const smokePrice = getSmokePrice(product);
    const chromelinePrice = getChromelinePrice(product);

    if (showSmoke && showChromeline) {
      return `${formatOriginalPrice(smokePrice)} / ${formatOriginalPrice(
        chromelinePrice
      )}`;
    }

    if (showChromeline) {
      return formatOriginalPrice(chromelinePrice);
    }

    return formatOriginalPrice(smokePrice);
  };

  const getDisplayPrice = (product) => {
    const type = getProductType(product);

    if (type === "parcel-tray") {
      return formatPrice(product.price);
    }

    const smokePrice = getSmokePrice(product);
    const chromelinePrice = getChromelinePrice(product);

    if (showSmoke && showChromeline) {
      return `${formatPrice(smokePrice)} / ${formatPrice(chromelinePrice)}`;
    }

    if (showChromeline) {
      return formatPrice(chromelinePrice);
    }

    return formatPrice(smokePrice);
  };

  const getDisplayOption = (product) => {
    const type = getProductType(product);

    if (type === "parcel-tray") return "Parcel Tray";

    if (showSmoke && showChromeline) return "Smoke / Chromeline";
    if (showChromeline) return "Chromeline";
    if (showSmoke) return "Smoke";

    return "Smoke";
  };

  const getSearchText = (product) => {
    return [
      product.id,
      product.carName,
      product.brandName,
      product.year,
      product.set,
      product.price,
      product.smokePrice,
      product.chromelinePrice,
      product.name,
      product.title,
      product.brand,
      product.series,
      product.category,
      product.productType,
      product.productCategory,
      product.type,
      product.variant,
      product.bracket,
      ...(product.carBrand || []),
      ...(product.carModel || []),
      ...(product.tags || []),
      product.specifications?.fitment,
      product.specifications?.pieces,
      getCarName(product),
      getBrandName(product),
      getYear(product),
      getSetCount(product),
      getSmokePrice(product),
      getChromelinePrice(product),
      getProductTypeLabel(getProductType(product)),
      `smoke ${getSmokePrice(product)}`,
      `chromeline ${getChromelinePrice(product)}`,
      "parcel tray",
      "door visor",
      `set ${product.set}`,
      `set of ${product.set}`,
      `price ${product.price}`,
      `₹${product.price}`,
    ].join(" ");
  };

  const brandOptions = useMemo(() => {
    const brands = new Set();

    products.forEach((product) => {
      getProductBrands(product).forEach((brand) => {
        if (brand && brand.trim()) {
          brands.add(brand.trim());
        }
      });
    });

    return Array.from(brands).sort((a, b) => a.localeCompare(b));
  }, []);

  const hasActiveSelection =
    normalize(search) ||
    selectedProductType !== "" ||
    selectedBrand !== "all" ||
    showSmoke ||
    showChromeline;

  const displayProducts = useMemo(() => {
    const query = normalize(search);

    if (
      !query &&
      selectedProductType === "" &&
      selectedBrand === "all" &&
      !showSmoke &&
      !showChromeline
    ) {
      return [];
    }

    let filteredProducts = products;

    if (selectedProductType) {
      filteredProducts = filteredProducts.filter(
        (product) => getProductType(product) === selectedProductType
      );
    }

    if (!selectedProductType && (showSmoke || showChromeline)) {
      filteredProducts = filteredProducts.filter(
        (product) => getProductType(product) === "door-visor"
      );
    }

    if (selectedBrand !== "all") {
      filteredProducts = filteredProducts.filter((product) =>
        getProductBrands(product).some(
          (brand) => normalize(brand) === normalize(selectedBrand)
        )
      );
    }

    if (query) {
      const queryWords = query.split(" ").filter(Boolean);

      filteredProducts = filteredProducts.filter((product) => {
        const text = getSearchText(product);
        const normalText = normalize(text);
        const compactText = compact(text);

        return queryWords.every((word) => {
          return (
            normalText.includes(word) || compactText.includes(compact(word))
          );
        });
      });
    }

    return filteredProducts;
  }, [
    search,
    selectedProductType,
    selectedBrand,
    showSmoke,
    showChromeline,
    selectedDiscount,
  ]);

  const totalProducts = products.length;

  const clearAllFilters = () => {
    setSearch("");
    setSelectedProductType("");
    setSelectedBrand("all");
    setShowSmoke(false);
    setShowChromeline(false);
    setSelectedDiscount(0);
  };

  const handleProductTypeChange = (type) => {
    setSelectedProductType(type);

    if (type === "parcel-tray") {
      setShowSmoke(false);
      setShowChromeline(false);
    }
  };

  const shouldShowDoorVisorPricing =
    selectedProductType === "door-visor" ||
    (!selectedProductType && (showSmoke || showChromeline));

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#101827]">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white px-4 py-4 shadow-sm">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="mt-1 text-2xl font-black leading-tight tracking-tight text-[#101827]">
                Find Your Car Accessory
              </h1>

              <p className="mt-1 text-sm font-semibold text-gray-500">
                Check the price of Door Visor and Parcel Tray instantly.
              </p>
            </div>

            <div className="flex items-center gap-2 md:justify-end">
              <div className="rounded-2xl bg-[#f3f6fb] p-2 ring-1 ring-gray-200">
                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.14em] text-blue-700">
                  Discount
                </p>

                <select
                  value={selectedDiscount}
                  onChange={(e) => setSelectedDiscount(Number(e.target.value))}
                  className="w-full rounded-xl bg-white px-3 py-2 text-xs font-black text-[#101827] outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-600 md:w-36"
                >
                  <option value={0}>No Discount</option>
                  {discountOptions.map((discount) => (
                    <option key={discount} value={discount}>
                      {discount}% OFF
                    </option>
                  ))}
                </select>
              </div>

              {(hasActiveSelection || selectedDiscount > 0) && (
                <button
                  onClick={clearAllFilters}
                  className="shrink-0 rounded-full bg-[#101827] px-4 py-2 text-xs font-black text-white shadow-sm"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-0 z-40 border-b border-gray-200 bg-[#f5f7fb]/95 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[28px] bg-white p-3 shadow-sm ring-1 ring-gray-100">
            <div className="space-y-3">
              {/* Product Type Tabs */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleProductTypeChange("door-visor")}
                  className={`rounded-2xl px-4 py-3 text-sm font-black transition ${selectedProductType === "door-visor"
                    ? "bg-[#101827] text-white shadow"
                    : "bg-[#f3f6fb] text-[#101827]"
                    }`}
                >
                  Door Visor
                </button>

                <button
                  onClick={() => handleProductTypeChange("parcel-tray")}
                  className={`rounded-2xl px-4 py-3 text-sm font-black transition ${selectedProductType === "parcel-tray"
                    ? "bg-blue-700 text-white shadow"
                    : "bg-[#f3f6fb] text-[#101827]"
                    }`}
                >
                  Parcel Tray
                </button>
              </div>

              {/* Search */}
              <div className="flex items-center gap-2 rounded-2xl bg-[#f3f6fb] px-3 py-3 ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-blue-600">
                <span className="text-lg">🔍</span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search car: Creta, Scorpio, Baleno..."
                  className="w-full bg-transparent text-sm font-black text-black outline-none placeholder:text-gray-400"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="rounded-full bg-gray-200 px-2.5 py-1.5 text-xs font-black text-gray-700"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Brand */}
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full appearance-none rounded-2xl bg-[#f3f6fb] px-4 py-3 text-sm font-black text-[#101827] outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-600"
                >
                  <option value="all">All Brands</option>
                  {brandOptions.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400">
                  ▼
                </span>
              </div>

              {/* Door Visor Options */}
              {selectedProductType !== "parcel-tray" && (
                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl px-3 py-3 text-center text-xs font-black ring-1 transition ${showSmoke
                      ? "bg-[#101827] text-white ring-[#101827]"
                      : "bg-[#f3f6fb] text-[#101827] ring-gray-200"
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={showSmoke}
                      onChange={(e) => {
                        setShowSmoke(e.target.checked);
                        if (e.target.checked && !selectedProductType) {
                          setSelectedProductType("door-visor");
                        }
                      }}
                      className="hidden"
                    />
                    <span>{showSmoke ? "✓" : "○"}</span>
                    Smoke
                  </label>

                  <label
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl px-3 py-3 text-center text-xs font-black ring-1 transition ${showChromeline
                      ? "bg-blue-700 text-white ring-blue-700"
                      : "bg-[#f3f6fb] text-[#101827] ring-gray-200"
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={showChromeline}
                      onChange={(e) => {
                        setShowChromeline(e.target.checked);
                        if (e.target.checked && !selectedProductType) {
                          setSelectedProductType("door-visor");
                        }
                      }}
                      className="hidden"
                    />
                    <span>{showChromeline ? "✓" : "○"}</span>
                    Chromeline
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Count */}
      <section className="mx-auto max-w-6xl px-4 py-4">
        <div className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">
                {hasActiveSelection ? "Result" : "Start"}
              </p>

              <h2 className="mt-1 text-3xl font-black tracking-tight">
                {hasActiveSelection ? displayProducts.length : "Search"}
              </h2>

              <p className="mt-1 text-xs font-semibold text-gray-500">
                Total available: {totalProducts}
              </p>
            </div>

            <div className="rounded-3xl bg-green-50 px-4 py-3 text-right">
              <p className="text-[10px] font-black uppercase text-green-700">
                Discount
              </p>

              <p className="text-sm font-black text-green-800">
                {selectedDiscount ? `${selectedDiscount}% OFF` : "None"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {selectedProductType && (
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700">
                {getProductTypeLabel(selectedProductType)}
              </span>
            )}

            {selectedBrand !== "all" && (
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700">
                {selectedBrand}
              </span>
            )}

            {selectedDiscount > 0 && (
              <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700">
                {selectedDiscount}% Discount Applied
              </span>
            )}

            {shouldShowDoorVisorPricing && showSmoke && (
              <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-black text-gray-700">
                Smoke
              </span>
            )}

            {shouldShowDoorVisorPricing && showChromeline && (
              <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-black text-gray-700">
                Chromeline
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        {!hasActiveSelection ? (
          <StartSearchBox />
        ) : displayProducts.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {displayProducts.map((product) =>
              getProductType(product) === "parcel-tray" ? (
                <ParcelTrayCard
                  key={product.id}
                  carName={getCarName(product)}
                  year={getYear(product)}
                  price={getDisplayPrice(product)}
                  originalPrice={getBasePriceText(product)}
                  discount={selectedDiscount}
                />
              ) : (
                <DoorVisorCard
                  key={product.id}
                  carCompany={getBrandName(product)}
                  carName={getCarName(product)}
                  setCount={getSetCount(product)}
                  price={getDisplayPrice(product)}
                  originalPrice={getBasePriceText(product)}
                  discount={selectedDiscount}
                  year={getYear(product)}
                  option={getDisplayOption(product)}
                />
              )
            )}
          </div>
        ) : (
          <NoProducts />
        )}
      </section>
    </main>
  );
}

function StartSearchBox() {
  return (
    <div className="rounded-[30px] bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-blue-50 text-4xl">
        🚗
      </div>

      <h3 className="mt-5 text-2xl font-black">Search Your Product</h3>

      <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-gray-500">
        Select Door Visor or Parcel Tray, then search by car name or brand and choose your option..
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {["Door Visor", "Parcel Tray", "Creta", "Scorpio"].map((item) => (
          <span
            key={item}
            className="rounded-full bg-[#f3f6fb] px-4 py-2 text-xs font-black text-gray-600"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function DoorVisorCard({
  carCompany,
  carName,
  setCount,
  price,
  originalPrice,
  discount,
  year,
  option,
}) {
  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-gray-100">
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700">
              {carCompany}
            </span>

            <h3 className="mt-3 text-lg font-black leading-snug text-[#101827]">
              {carName}
            </h3>
          </div>

          <div className="shrink-0 rounded-2xl bg-green-50 px-3 py-2 text-right">
            <p className="text-[10px] font-black uppercase text-green-600">
              Price
            </p>

            {discount > 0 && (
              <p className="text-xs font-black text-gray-400 line-through">
                {originalPrice}
              </p>
            )}

            <p className="text-lg font-black leading-tight text-green-700">
              {price}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <MiniInfo label="Set" value={setCount} />
          <MiniInfo label="Year" value={year} />
          <MiniInfo label="Option" value={option} />
        </div>
      </div>
    </div>
  );
}

function ParcelTrayCard({ carName, year, price, originalPrice, discount }) {
  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-blue-100">
      <div className="bg-linear-to-r from-blue-700 to-[#101827] p-4 text-white">
        <p className="w-fit rounded-full bg-white/15 px-3 py-1.5 text-xs font-black">
          Parcel Tray
        </p>

        <h3 className="mt-3 text-xl font-black leading-snug">{carName}</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        <div className="rounded-2xl bg-[#f3f6fb] p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">
            Year
          </p>
          <p className="mt-1 text-sm font-black text-[#101827]">{year}</p>
        </div>

        <div className="rounded-2xl bg-green-50 p-3 text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-green-600">
            Price
          </p>

          {discount > 0 && (
            <p className="text-xs font-black text-gray-400 line-through">
              {originalPrice}
            </p>
          )}

          <p className="mt-1 text-lg font-black text-green-700">{price}</p>
        </div>
      </div>
    </div>
  );
}

function MiniInfo({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#f3f6fb] p-3 text-center">
      <p className="text-[9px] font-black uppercase tracking-[0.14em] text-gray-400">
        {label}
      </p>
      <p className="mt-1 line-clamp-1 text-xs font-black text-gray-800">
        {value}
      </p>
    </div>
  );
}

function NoProducts() {
  return (
    <div className="rounded-[30px] bg-white p-10 text-center shadow-sm ring-1 ring-gray-100">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
        🔎
      </div>

      <h3 className="mt-5 text-2xl font-black">No product found</h3>

      <p className="mx-auto mt-2 max-w-md text-sm font-medium text-gray-500">
        Try searching Creta, Scorpio, Swift, Baleno, Nexon, Door Visor or Parcel
        Tray.
      </p>
    </div>
  );
}