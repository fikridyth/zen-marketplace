<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * List all categories (public).
     */
    public function index(): JsonResponse
    {
        $categories = Category::withCount('products')
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }

    /**
     * Show a single category with its products (public).
     */
    public function show(string $slug): JsonResponse
    {
        $category = Category::where('slug', $slug)->firstOrFail();

        $products = $category->products()
            ->with('user:id,name', 'category:id,name,slug,icon')
            ->latest()
            ->paginate(12);

        return response()->json([
            'category' => $category,
            'products' => $products,
        ]);
    }
}
