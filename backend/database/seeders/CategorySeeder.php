<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\HeroBanner;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Seed the categories table.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Electronics', 'slug' => 'electronics', 'icon' => '💻'],
            ['name' => 'Fashion', 'slug' => 'fashion', 'icon' => '👗'],
            ['name' => 'Home & Living', 'slug' => 'home-living', 'icon' => '🏠'],
            ['name' => 'Sports', 'slug' => 'sports', 'icon' => '⚽'],
            ['name' => 'Books', 'slug' => 'books', 'icon' => '📚'],
            ['name' => 'Beauty', 'slug' => 'beauty', 'icon' => '💄'],
            ['name' => 'Food & Beverages', 'slug' => 'food-beverages', 'icon' => '🍔'],
            ['name' => 'Toys & Hobbies', 'slug' => 'toys-hobbies', 'icon' => '🎮'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }

        // Assign random categories to existing products that don't have one
        $categoryIds = Category::pluck('id')->toArray();
        Product::whereNull('category_id')->each(function ($product) use ($categoryIds) {
            $product->update([
                'category_id' => $categoryIds[array_rand($categoryIds)],
            ]);
        });
    }
}
