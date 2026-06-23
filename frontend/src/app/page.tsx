import { ProductCard } from "@/components/product-card";
import { PaginatedResponse, Product } from "@/types";

// Force dynamic rendering if we don't want to statically cache
export const dynamic = "force-dynamic";

async function getProducts(): Promise<PaginatedResponse<Product>> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
  try {
    const res = await fetch(`${apiUrl}/products`, {
      cache: "no-store", // disable caching for live data
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return empty payload on error
    return { data: [], current_page: 1, last_page: 1, per_page: 12, total: 0, from: null, to: null };
  }
}

export default async function LandingPage() {
  const { data: products } = await getProducts();

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge variant="outline" className="mb-6 border-indigo-500/30 text-indigo-300 bg-indigo-500/10 px-4 py-1.5 rounded-full text-sm">
            ✨ Welcome to the future of commerce
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Amazing</span> Products
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            A premium headless e-commerce experience. Browse curated items from independent sellers around the globe.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 pb-24 flex-grow">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Latest Arrivals</h2>
          <span className="text-zinc-400 text-sm">{products.length} products found</span>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-zinc-900/30 rounded-2xl border border-zinc-800 border-dashed">
            <span className="text-5xl mb-4 block">🏜️</span>
            <h3 className="text-xl font-medium text-white mb-2">No products found</h3>
            <p className="text-zinc-400">Our sellers are preparing some amazing items for you.</p>
          </div>
        )}
      </section>
    </div>
  );
}

// Temporary Badge component for Hero (since we don't have it imported at top)
function Badge({ children, className, variant }: any) {
  return (
    <span className={`inline-flex items-center border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}
