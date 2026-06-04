"use client";

import { useMemo, useState } from "react";
import products from "@/app/data/products";
// Agar file src/data/products.js me hai to upar wali line ko ye kar dena:
// import products from "@/data/products";

export default function LandingPage() {
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [showSmoke, setShowSmoke] = useState(false);
  const [showChromeline, setShowChromeline] = useState(false);

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
    return "Set details";
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

  const getDisplayPrice = (product) => {
    const smokePrice = getSmokePrice(product);
    const chromelinePrice = getChromelinePrice(product);

    if (showSmoke && showChromeline) {
      return `₹${smokePrice} / ₹${chromelinePrice}`;
    }

    if (showChromeline) {
      return `₹${chromelinePrice}`;
    }

    return `₹${smokePrice}`;
  };

  const getDisplayType = () => {
    if (showSmoke && showChromeline) return "Smoke / Chromeline";
    if (showChromeline) return "Chromeline";
    if (showSmoke) return "Smoke";
    return "Smoke";
  };

  const brandOptions = useMemo(() => {
    const brands = new Set();

    products.forEach((product) => {
      getProductBrands(product).forEach((brand) => brands.add(brand));
    });

    return Array.from(brands).sort((a, b) => a.localeCompare(b));
  }, []);

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
      product.brand,
      product.series,
      product.category,
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
      `smoke ${getSmokePrice(product)}`,
      `chromeline ${getChromelinePrice(product)}`,
      `set ${product.set}`,
      `set of ${product.set}`,
      `price ${product.price}`,
      `₹${product.price}`,
    ].join(" ");
  };

  const hasActiveSelection =
    normalize(search) || selectedBrand !== "all" || showSmoke || showChromeline;

  const displayProducts = useMemo(() => {
    const query = normalize(search);

    if (!query && selectedBrand === "all" && !showSmoke && !showChromeline) {
      return [];
    }

    let filteredProducts = products;

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
          return normalText.includes(word) || compactText.includes(compact(word));
        });
      });
    }

    return filteredProducts;
  }, [search, selectedBrand, showSmoke, showChromeline]);

  const totalProducts = products.length;

  const clearAllFilters = () => {
    setSearch("");
    setSelectedBrand("all");
    setShowSmoke(false);
    setShowChromeline(false);
  };

  return (
    <main className="min-h-screen bg-[#eef3fb] text-[#101827]">
      {/* TOP AREA */}
      <section className="sticky top-0 z-50 border-b border-white/40 bg-[#eef3fb]/95 px-3 pb-3 pt-3 backdrop-blur-xl md:px-5">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#101827] via-[#173b88] to-[#0f172a] p-4 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-3 text-white">
              <div>
                <p className="mb-1 w-fit rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-blue-100">
                  Door Visor Finder
                </p>

                <h1 className="text-2xl font-black leading-tight tracking-tight md:text-4xl">
                  Find Your Car Door Visor
                </h1>

                <p className="mt-1 text-xs font-semibold text-white/70 md:text-sm">
                  Search, brand select karo ya pricing type choose karo
                </p>
              </div>

              {hasActiveSelection && (
                <button
                  onClick={clearAllFilters}
                  className="shrink-0 rounded-full bg-white px-4 py-2 text-xs font-black text-[#111827] shadow"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="rounded-[24px] bg-white p-3 shadow-2xl">
              <div className="space-y-3">
                {/* Search */}
                <div className="flex items-center gap-2 rounded-2xl bg-[#f4f7fb] px-3 py-3 ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-blue-600">
                  <span className="text-lg">🔍</span>

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search: Creta, Scorpio, Baleno..."
                    className="w-full bg-transparent text-sm font-black text-black outline-none placeholder:text-gray-400 md:text-base"
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

                {/* Brand Select */}
                <div className="relative">
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full appearance-none rounded-2xl bg-[#f4f7fb] px-4 py-3 text-sm font-black text-[#111827] outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-600 md:text-base"
                  >
                    <option value="all">Select Car Brand</option>
                    {brandOptions.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-gray-400">
                    ▼
                  </span>
                </div>

                {/* Type Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl px-3 py-3 text-center text-xs font-black shadow-sm ring-1 transition md:text-sm ${showSmoke
                        ? "bg-[#111827] text-white ring-[#111827]"
                        : "bg-[#f4f7fb] text-[#111827] ring-gray-200"
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={showSmoke}
                      onChange={(e) => setShowSmoke(e.target.checked)}
                      className="hidden"
                    />
                    <span>{showSmoke ? "✓" : "○"}</span>
                    Smoke
                  </label>

                  <label
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl px-3 py-3 text-center text-xs font-black shadow-sm ring-1 transition md:text-sm ${showChromeline
                        ? "bg-blue-700 text-white ring-blue-700"
                        : "bg-[#f4f7fb] text-[#111827] ring-gray-200"
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={showChromeline}
                      onChange={(e) => setShowChromeline(e.target.checked)}
                      className="hidden"
                    />
                    <span>{showChromeline ? "✓" : "○"}</span>
                    Chromeline
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COUNT CARD */}
      <section className="mx-auto max-w-7xl px-3 py-4 md:px-5">
        <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">
                {hasActiveSelection ? "Products Found" : "Start Search"}
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight md:text-4xl">
                {hasActiveSelection ? `${displayProducts.length}` : "Search"}
              </h2>

              <p className="mt-1 text-xs font-semibold text-gray-500 md:text-sm">
                Total available: {totalProducts}
              </p>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-green-50 to-emerald-100 px-4 py-3 text-right">
              <p className="text-[10px] font-black uppercase text-green-700">
                Showing
              </p>

              <p className="text-sm font-black text-green-800">
                {hasActiveSelection ? getDisplayType() : "None"}
              </p>
            </div>
          </div>

          {selectedBrand !== "all" && (
            <div className="mt-4 w-fit rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-700">
              Brand: {selectedBrand}
            </div>
          )}
        </div>
      </section>

      {/* RESULTS */}
      <section className="mx-auto max-w-7xl px-3 pb-10 md:px-5">
        {!hasActiveSelection ? (
          <StartSearchBox />
        ) : displayProducts.length > 0 ? (
          <>
            <div className="grid gap-3 md:hidden">
              {displayProducts.map((product) => (
                <MobileProductCard
                  key={product.id}
                  carCompany={getBrandName(product)}
                  carName={getCarName(product)}
                  setCount={getSetCount(product)}
                  price={getDisplayPrice(product)}
                  year={getYear(product)}
                  visorType={getDisplayType()}
                />
              ))}
            </div>

            <div className="hidden overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm md:block">
              <div className="grid grid-cols-[1.1fr_2fr_0.8fr_1fr_1fr_1fr] gap-4 bg-[#111827] px-5 py-4 text-xs font-black uppercase tracking-[0.16em] text-white">
                <p>Car Company</p>
                <p>Car Name</p>
                <p>Set</p>
                <p>Price</p>
                <p>Year</p>
                <p>Type</p>
              </div>

              <div className="divide-y divide-gray-100">
                {displayProducts.map((product) => (
                  <DesktopProductRow
                    key={product.id}
                    carCompany={getBrandName(product)}
                    carName={getCarName(product)}
                    setCount={getSetCount(product)}
                    price={getDisplayPrice(product)}
                    year={getYear(product)}
                    visorType={getDisplayType()}
                  />
                ))}
              </div>
            </div>
          </>
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
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-blue-50 to-blue-100 text-4xl">
        🚗
      </div>

      <h3 className="mt-5 text-2xl font-black">Search Your Car</h3>

      <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-gray-500">
        Car name search karo, brand select karo ya Smoke / Chromeline pricing
        choose karo.
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {["Creta", "Scorpio", "Baleno", "Nexon"].map((item) => (
          <span
            key={item}
            className="rounded-full bg-[#f4f7fb] px-4 py-2 text-xs font-black text-gray-600"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function MobileProductCard({
  carCompany,
  carName,
  setCount,
  price,
  year,
  visorType,
}) {
  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-gray-100">
      <div className="bg-gradient-to-r from-[#111827] to-[#1e3a8a] p-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="w-fit rounded-full bg-white/15 px-3 py-1.5 text-xs font-black">
              {carCompany}
            </p>

            <h3 className="mt-3 text-lg font-black leading-snug">
              {carName}
            </h3>
          </div>

          <div className="shrink-0 rounded-2xl bg-white px-3 py-2 text-right text-[#111827]">
            <p className="text-[10px] font-black uppercase text-green-600">
              Price
            </p>
            <p className="text-lg font-black leading-tight text-green-700">
              {price}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-3">
        <MiniInfo label="Set" value={setCount} />
        <MiniInfo label="Year" value={year} />
        <MiniInfo label="Type" value={visorType} />
      </div>
    </div>
  );
}

function MiniInfo({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#f4f7fb] p-3 text-center">
      <p className="text-[9px] font-black uppercase tracking-[0.14em] text-gray-400">
        {label}
      </p>
      <p className="mt-1 line-clamp-1 text-xs font-black text-gray-800">
        {value}
      </p>
    </div>
  );
}

function DesktopProductRow({
  carCompany,
  carName,
  setCount,
  price,
  year,
  visorType,
}) {
  return (
    <div className="grid grid-cols-[1.1fr_2fr_0.8fr_1fr_1fr_1fr] items-center gap-4 px-5 py-5 transition hover:bg-blue-50/50">
      <p className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-sm font-black text-blue-700">
        {carCompany}
      </p>

      <p className="text-base font-black leading-snug text-[#111827]">
        {carName}
      </p>

      <p className="text-sm font-black text-gray-700">{setCount}</p>

      <p className="text-lg font-black text-green-700">{price}</p>

      <p className="text-sm font-bold text-gray-600">{year}</p>

      <p className="w-fit rounded-full bg-gray-100 px-3 py-1.5 text-sm font-black text-gray-700">
        {visorType}
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
        Try searching Creta, Scorpio, Swift, Baleno, Nexon, Venue, Set 4 or Set
        6.
      </p>
    </div>
  );
}