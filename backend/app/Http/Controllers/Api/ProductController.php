<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * List all products (public).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('user:id,name', 'category:id,name,slug,icon', 'primaryImage')
            ->withAvg('reviews', 'rating')
            ->withCount('reviews');

        // Optional search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Optional category filter
        if ($request->has('category')) {
            $category = Category::where('slug', $request->input('category'))->first();
            if ($category) {
                $query->where('category_id', $category->id);
            }
        }

        // Flash sale filter (highest discount first, limit to 4)
        if ($request->has('flash_sale')) {
            $products = $query->orderByDesc('discount')->take(4)->get();
            return response()->json(['data' => $products]);
        }

        $products = $query->latest()->paginate(12);

        return response()->json($products);
    }

    /**
     * Show a single product by slug (public).
     */
    public function show(string $slug): JsonResponse
    {
        $product = Product::with('user:id,name', 'category:id,name,slug,icon', 'images')
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json([
            'product' => $product,
        ]);
    }

    /**
     * Store a new product (seller only).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price'       => ['required', 'numeric', 'min:0'],
            'stock'       => ['required', 'integer', 'min:0'],
            'image_url'   => ['nullable', 'string', 'url', 'max:2048'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['slug'] = Str::slug($validated['name']);

        // Ensure slug uniqueness
        $originalSlug = $validated['slug'];
        $count = 1;
        while (Product::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $originalSlug . '-' . $count++;
        }

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Product created successfully.',
            'product' => $product,
        ], 201);
    }

    /**
     * Update an existing product (seller only, own products).
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'name'        => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price'       => ['sometimes', 'numeric', 'min:0'],
            'stock'       => ['sometimes', 'integer', 'min:0'],
            'image_url'   => ['nullable', 'string', 'url', 'max:2048'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
        ]);

        // Regenerate slug if name changed
        if (isset($validated['name'])) {
            $slug = Str::slug($validated['name']);
            $originalSlug = $slug;
            $count = 1;
            while (Product::where('slug', $slug)->where('id', '!=', $product->id)->exists()) {
                $slug = $originalSlug . '-' . $count++;
            }
            $validated['slug'] = $slug;
        }

        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully.',
            'product' => $product->fresh(),
        ]);
    }

    /**
     * Delete a product (seller only, own products).
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $product = Product::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully.',
        ]);
    }

    /**
     * List products for the authenticated seller (admin dashboard).
     */
    public function myProducts(Request $request): JsonResponse
    {
        $products = Product::where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json($products);
    }
}
