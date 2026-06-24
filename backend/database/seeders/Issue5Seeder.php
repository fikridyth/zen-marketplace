<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Review;
use App\Models\User;

class Issue5Seeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::take(10)->get();

        // Create a few dummy users to act as buyers leaving reviews
        $buyers = [];
        for ($i = 1; $i <= 3; $i++) {
            $buyers[] = User::firstOrCreate(
                ['email' => "buyer{$i}@example.com"],
                [
                    'name' => "Buyer {$i}",
                    'password' => bcrypt('password'),
                    'role' => 'buyer'
                ]
            );
        }

        $imagePool = [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
            'https://images.unsplash.com/photo-1572635196237-14b3f281501f?w=800&q=80',
        ];

        foreach ($products as $index => $product) {
            // Apply a random discount (e.g. 10%, 20%, 30%, 40%, 50%)
            $product->update(['discount' => rand(1, 5) * 10]);

            // Add 3 extra images per product
            for ($i = 0; $i < 3; $i++) {
                ProductImage::firstOrCreate([
                    'product_id' => $product->id,
                    'image_url' => $imagePool[array_rand($imagePool)],
                    'is_primary' => false,
                    'sort_order' => $i + 1,
                ]);
            }

            // Add random reviews from the dummy buyers
            foreach ($buyers as $buyer) {
                if (rand(0, 1)) { // 50% chance to leave a review
                    Review::firstOrCreate(
                        ['user_id' => $buyer->id, 'product_id' => $product->id],
                        [
                            'rating' => rand(3, 5),
                            'comment' => 'This is a sample review for ' . $product->name . '. Quality is quite good.',
                        ]
                    );
                }
            }
        }
    }
}
