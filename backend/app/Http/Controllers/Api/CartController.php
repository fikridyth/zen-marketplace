<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * List all cart items for the authenticated buyer.
     */
    public function index(Request $request): JsonResponse
    {
        $cartItems = Cart::with('product:id,name,slug,price,stock,image_url')
            ->where('user_id', $request->user()->id)
            ->get();

        $total = $cartItems->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        return response()->json([
            'cart_items' => $cartItems,
            'total'      => round($total, 2),
            'count'      => $cartItems->count(),
        ]);
    }

    /**
     * Add a product to cart (or increment quantity if already exists).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity'   => ['sometimes', 'integer', 'min:1'],
        ]);

        $quantity = $validated['quantity'] ?? 1;

        // Check if item already in cart — increment if so
        $cartItem = Cart::where('user_id', $request->user()->id)
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($cartItem) {
            $cartItem->update([
                'quantity' => $cartItem->quantity + $quantity,
            ]);
            $message = 'Cart item quantity updated.';
        } else {
            $cartItem = Cart::create([
                'user_id'    => $request->user()->id,
                'product_id' => $validated['product_id'],
                'quantity'   => $quantity,
            ]);
            $message = 'Product added to cart.';
        }

        $cartItem->load('product:id,name,slug,price,stock,image_url');

        return response()->json([
            'message'   => $message,
            'cart_item' => $cartItem,
        ], 201);
    }

    /**
     * Update the quantity of a cart item.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $cartItem = Cart::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cartItem->update($validated);

        $cartItem->load('product:id,name,slug,price,stock,image_url');

        return response()->json([
            'message'   => 'Cart item updated.',
            'cart_item' => $cartItem,
        ]);
    }

    /**
     * Remove a cart item.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $cartItem = Cart::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $cartItem->delete();

        return response()->json([
            'message' => 'Item removed from cart.',
        ]);
    }
}
