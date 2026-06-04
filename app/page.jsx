"use client";

import { useMemo, useState } from "react";
import products from "@/app/data/products";
// Agar file src/data/products.js me hai to upar wali line ko ye kar dena:
// import products from "@/data/products";

export default function LandingPage() {
  const [search, setSearch] = useState("");
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
      product.visorType,
      product.doorVisorType,
      product.finish,
      product.type,
      product.productType,
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

  const displayProducts = useMemo(() => {
    const query = normalize(search);

    if (!query) {
      return products;
    }

    const queryWords = query.split(" ").filter(Boolean);

    return products.filter((product) => {
      const text = getSearchText(product);
      const normalText = normalize(text);
      const compactText = compact(text);

      return queryWords.every((word) => {
        return normalText.includes(word) || compactText.includes(compact(word));
      });
    });
  }, [search, showSmoke, showChromeline]);

  const totalProducts = products.length;

  const clearAllFilters = () => {
    setSearch("");
    setShowSmoke(false);
    setShowChromeline(false);
  };

  const isFiltered = search || showSmoke || showChromeline;

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#111827]">
      {/* Top Search Bar */}
      <section className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-xl">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex flex-col justify-between gap-2 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-black tracking-tight md:text-3xl">
                Door Visor Product List
              </h1>

              <p className="mt-1 text-sm font-semibold text-gray-500">
                Search karo ya Smoke / Chromeline pricing select karo
              </p>
            </div>

            {isFiltered && (
              <button
                onClick={clearAllFilters}
                className="w-fit rounded-full bg-[#111827] px-5 py-2.5 text-sm font-black text-white shadow transition hover:bg-blue-700"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr]">
            <div className="flex items-center gap-3 rounded-2xl bg-[#f4f7fb] px-4 py-3 ring-1 ring-gray-200 transition focus-within:ring-2 focus-within:ring-blue-600">
              <span className="text-xl">🔍</span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search: Creta, Scorpio, Baleno 2022, Set 6..."
                className="w-full bg-transparent text-base font-semibold text-black outline-none placeholder:text-gray-400"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="rounded-full bg-gray-200 px-3 py-2 text-sm font-black text-gray-700 transition hover:bg-gray-300"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="grid gap-3 rounded-2xl bg-[#f4f7fb] p-3 ring-1 ring-gray-200 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm transition hover:bg-blue-50">
                <input
                  type="checkbox"
                  checked={showSmoke}
                  onChange={(e) => setShowSmoke(e.target.checked)}
                  className="h-5 w-5 accent-blue-700"
                />
                <span className="text-sm font-black text-[#111827]">
                  Smoke Door Visor
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm transition hover:bg-blue-50">
                <input
                  type="checkbox"
                  checked={showChromeline}
                  onChange={(e) => setShowChromeline(e.target.checked)}
                  className="h-5 w-5 accent-blue-700"
                />
                <span className="text-sm font-black text-[#111827]">
                  Chromeline Door Visor
                </span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Products Data List */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">
              {isFiltered ? "Filtered Products" : "All Products"}
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight md:text-4xl">
              {displayProducts.length} products found
            </h2>

            <p className="mt-2 text-sm font-semibold text-gray-500">
              Total products: {totalProducts}
            </p>
          </div>
        </div>

        {displayProducts.length > 0 ? (
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="hidden bg-[#111827] px-5 py-4 text-xs font-black uppercase tracking-[0.16em] text-white md:grid md:grid-cols-[1.1fr_2fr_0.8fr_1fr_1fr_1fr] md:gap-4">
              <p>Car Company</p>
              <p>Car Name</p>
              <p>Set</p>
              <p>Price</p>
              <p>Year</p>
              <p>Type</p>
            </div>

            <div className="divide-y divide-gray-100">
              {displayProducts.map((product) => (
                <ProductListRow
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
        ) : (
          <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
              🔎
            </div>

            <h3 className="mt-5 text-2xl font-black">No product found</h3>

            <p className="mx-auto mt-2 max-w-md text-sm font-medium text-gray-500">
              Try searching Creta, Scorpio, Swift, Baleno, Nexon, Venue, Set 4
              or Set 6.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

function ProductListRow({
  carCompany,
  carName,
  setCount,
  price,
  year,
  visorType,
}) {
  return (
    <div className="grid gap-3 px-5 py-5 transition hover:bg-blue-50/50 md:grid-cols-[1.1fr_2fr_0.8fr_1fr_1fr_1fr] md:items-center md:gap-4">
      <div>
        <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-gray-400 md:hidden">
          Car Company
        </p>

        <p className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-sm font-black text-blue-700">
          {carCompany}
        </p>
      </div>

      <div>
        <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-gray-400 md:hidden">
          Car Name
        </p>

        <p className="text-base font-black leading-snug text-[#111827]">
          {carName}
        </p>
      </div>

      <div>
        <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-gray-400 md:hidden">
          Set
        </p>

        <p className="text-sm font-black text-gray-700">{setCount}</p>
      </div>

      <div>
        <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-gray-400 md:hidden">
          Price
        </p>

        <p className="text-lg font-black text-green-700">{price}</p>
      </div>

      <div>
        <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-gray-400 md:hidden">
          Year
        </p>

        <p className="text-sm font-bold text-gray-600">{year}</p>
      </div>

      <div>
        <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-gray-400 md:hidden">
          Type
        </p>

        <p className="w-fit rounded-full bg-gray-100 px-3 py-1.5 text-sm font-black text-gray-700">
          {visorType}
        </p>
      </div>
    </div>
  );
}