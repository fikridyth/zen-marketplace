<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)->firstOrFail();
        
        $reviews = Review::with('user:id,name')
            ->where('product_id', $product->id)
            ->latest()
            ->get();

        return response()->json($reviews);
    }

    public function store(Request $request, string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review = Review::updateOrCreate(
            ['user_id' => $request->user()->id, 'product_id' => $product->id],
            ['rating' => $validated['rating'], 'comment' => $validated['comment']]
        );

        return response()->json([
            'message' => 'Review submitted',
            'review' => $review->load('user:id,name')
        ], 201);
    }
}
