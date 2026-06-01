"use client";

import { useMemo, useState } from "react";
import products from "@/app/data/products";

export default function LandingPage() {
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");

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
      `set ${product.set}`,
      `set of ${product.set}`,
      `price ${product.price}`,
      `₹${product.price}`,
    ].join(" ");
  };

  const displayProducts = useMemo(() => {
    const query = normalize(search);
    const hasBrandFilter = selectedBrand !== "all";

    let filteredProducts = products;

    if (hasBrandFilter) {
      filteredProducts = filteredProducts.filter((product) =>
        getProductBrands(product).some(
          (brand) => normalize(brand) === normalize(selectedBrand)
        )
      );
    }

    if (!query) {
      return filteredProducts;
    }

    const queryWords = query.split(" ").filter(Boolean);

    return filteredProducts.filter((product) => {
      const text = getSearchText(product);
      const normalText = normalize(text);
      const compactText = compact(text);

      return queryWords.every((word) => {
        return normalText.includes(word) || compactText.includes(compact(word));
      });
    });
  }, [search, selectedBrand]);

  const totalProducts = products.length;
  const totalBrands = brandOptions.length;

  const quickSearches = [
    "Creta",
    "Scorpio",
    "Baleno 2022",
    "Nexon",
    "Set 4",
    "Set 6",
    "500",
    "1100",
  ];

  const clearAllFilters = () => {
    setSearch("");
    setSelectedBrand("all");
  };

  const getListTitle = () => {
    if (search && selectedBrand !== "all") {
      return `${selectedBrand} results for “${search}”`;
    }

    if (selectedBrand !== "all") {
      return `${selectedBrand} Cars`;
    }

    if (search) {
      return `Results for “${search}”`;
    }

    return "All Products";
  };

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#111827]">
      <section className="relative overflow-hidden px-4 py-8 md:py-12">
        <div className="absolute inset-0 bg-linear-to-br from-[#0f172a] via-[#1e3a8a] to-[#111827]" />
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#f4f7fb] to-transparent" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="py-8 text-white md:py-14">
              <div className="mb-5 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
                  Premium Door Visor
                </span>

                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
                  Car Accessories
                </span>
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
                Smoke  Door Visor For Your Car
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 md:text-lg">
                Brand select karo ya car name search karo — matching cars
                instantly list me aa jayengi.
              </p>

              <div className="mt-8 max-w-4xl rounded-[28px] border border-white/15 bg-white/10 p-2 shadow-2xl backdrop-blur-xl">
                <div className="grid gap-3 rounded-[22px] bg-white p-3 md:grid-cols-[1.4fr_0.8fr]">
                  <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3">
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

                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="rounded-2xl bg-gray-50 px-4 py-3 text-base font-black text-[#111827] outline-none ring-1 ring-gray-200 transition focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="all">All Brands</option>
                    {brandOptions.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {quickSearches.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSearch(item)}
                    className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white hover:text-[#111827]"
                  >
                    {item.includes("1025") || item.includes("1500")
                      ? `₹${item}`
                      : item}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative rounded-[36px] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
                <div className="rounded-[28px] bg-white p-5 text-[#111827]">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black">Brand Finder</h3>
                    </div>

                    <div className="rounded-2xl bg-blue-50 px-4 py-3 text-2xl">
                      🚗
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <StatCard label="Products" value={`${totalProducts}+`} />
                    <StatCard label="Brands" value={`${totalBrands}+`} />
                    <StatCard label="4 Set Price" value="₹500" />
                    <StatCard label="6 Set Price" value="₹1100" />
                  </div>

                  <div className="mt-4 rounded-3xl bg-linear-to-br from-blue-50 to-slate-100 p-4">
                    <p className="text-sm font-bold text-gray-500">
                      Brand Filter
                    </p>
                    <p className="mt-1 text-xl font-black">
                      Select Brand Name
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gray-600">
                      Maruti, Hyundai, Tata, Mahindra, Toyota etc. select karte
                      hi us brand ki sari cars show hongi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-3 pb-8 lg:hidden">
            <StatCard label="Products" value={`${totalProducts}+`} dark />
            <StatCard label="Brands" value={`${totalBrands}+`} dark />
            <StatCard label="4 Set" value="₹500" dark />
            <StatCard label="6 Set" value="1100" dark />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 pt-4">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">
              {search || selectedBrand !== "all"
                ? "Filtered List"
                : "All Products"}
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
              {getListTitle()}
            </h2>

            <p className="mt-2 text-sm font-semibold text-gray-500">
              {displayProducts.length} products found
            </p>
          </div>

          {(search || selectedBrand !== "all") && (
            <button
              onClick={clearAllFilters}
              className="w-fit rounded-full bg-[#111827] px-6 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Clear Filters
            </button>
          )}
        </div>

        {displayProducts.length > 0 ? (
          <div className="overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm">
            <div className="hidden bg-[#111827] px-5 py-4 text-xs font-black uppercase tracking-[0.16em] text-white md:grid md:grid-cols-[1.1fr_2fr_0.8fr_0.9fr_1fr] md:gap-4">
              <p>Car Company</p>
              <p>Car Name</p>
              <p>Set</p>
              <p>Price</p>
              <p>Year</p>
            </div>

            <div className="divide-y divide-gray-100">
              {displayProducts.map((product) => (
                <ProductListRow
                  key={product.id}
                  carCompany={getBrandName(product)}
                  carName={getCarName(product)}
                  setCount={getSetCount(product)}
                  price={product.price}
                  year={getYear(product)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-[28px] border border-gray-100 bg-white p-10 text-center shadow-sm">
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

function ProductListRow({ carCompany, carName, setCount, price, year }) {
  return (
    <div className="grid gap-3 px-5 py-5 transition hover:bg-blue-50/50 md:grid-cols-[1.1fr_2fr_0.8fr_0.9fr_1fr] md:items-center md:gap-4">
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
        <p className="text-lg font-black text-green-700">₹{price}</p>
      </div>

      <div>
        <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-gray-400 md:hidden">
          Year
        </p>
        <p className="text-sm font-bold text-gray-600">{year}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, dark = false }) {
  return (
    <div
      className={`rounded-3xl p-4 shadow-sm ${dark
          ? "border border-white/10 bg-white/10 text-white backdrop-blur"
          : "bg-[#f6f7fb] text-[#111827]"
        }`}
    >
      <p
        className={`text-xs font-black uppercase tracking-[0.18em] ${dark ? "text-white/60" : "text-gray-400"
          }`}
      >
        {label}
      </p>

      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}