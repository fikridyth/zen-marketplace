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

        // Flash sale filter (highest discount first, discount > 50, limit to 10)
        if ($request->has('flash_sale')) {
            $products = $query->where('discount', '>', 50)
                              ->orderByDesc('discount')
                              ->take(10)
                              ->get();
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
            'images'      => ['nullable', 'array'],
            'images.*'    => ['file', 'image', 'max:2048'],
            'image_urls'  => ['nullable', 'array'],
            'image_urls.*'=> ['url', 'max:2048'],
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

        // Handle uploaded file images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('products', 'public');
                $product->images()->create([
                    'image_url' => asset('storage/' . $path),
                    'is_primary' => false,
                ]);
            }
        }

        // Handle string URL images
        if ($request->has('image_urls')) {
            foreach ($request->input('image_urls') as $url) {
                $product->images()->create([
                    'image_url' => $url,
                    'is_primary' => false,
                ]);
            }
        }

        // Ensure there is a primary image if images were added
        if ($product->images()->count() > 0 && !$product->images()->where('is_primary', true)->exists()) {
            $product->images()->first()->update(['is_primary' => true]);
        }

        return response()->json([
            'message' => 'Product created successfully.',
            'product' => $product->load('images'),
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
            'images'      => ['nullable', 'array'],
            'images.*'    => ['file', 'image', 'max:2048'],
            'image_urls'  => ['nullable', 'array'],
            'image_urls.*'=> ['url', 'max:2048'],
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

        // Handle uploaded file images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('products', 'public');
                $product->images()->create([
                    'image_url' => asset('storage/' . $path),
                    'is_primary' => false,
                ]);
            }
        }

        // Handle string URL images
        if ($request->has('image_urls')) {
            foreach ($request->input('image_urls') as $url) {
                $product->images()->create([
                    'image_url' => $url,
                    'is_primary' => false,
                ]);
            }
        }

        // Ensure primary image exists if images exist
        if ($product->images()->count() > 0 && !$product->images()->where('is_primary', true)->exists()) {
            $product->images()->first()->update(['is_primary' => true]);
        }

        return response()->json([
            'message' => 'Product updated successfully.',
            'product' => $product->fresh('images'),
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
