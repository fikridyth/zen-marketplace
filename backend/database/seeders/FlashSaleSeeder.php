<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class FlashSaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get 5 random products and give them a massive discount > 50%
        $products = Product::inRandomOrder()->take(5)->get();

        foreach ($products as $product) {
            $product->update([
                'discount' => rand(51, 90) // Between 51% and 90%
            ]);
        }
    }
}
