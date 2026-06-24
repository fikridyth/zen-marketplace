<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use App\Models\Category;
use Illuminate\Support\Str;

class Issue6AdditionalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Cleanup previous fake products if they exist
        Product::where('name', 'like', 'Additional Product%')->delete();

        // Get or create a seller user
        $seller = User::where('role', 'seller')->first();
        if (!$seller) {
            $seller = User::create([
                'name' => 'Premium Tech Seller',
                'email' => 'premiumtech@example.com',
                'password' => bcrypt('password'),
                'role' => 'seller',
            ]);
        }

        // Get a category or create one
        $category = Category::firstOrCreate(
            ['slug' => 'electronics'],
            ['name' => 'Electronics', 'icon' => '⚡']
        );

        $realProducts = [
            // 6 items with discount > 50
            [
                'name' => 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
                'description' => 'Industry-leading noise cancellation optimized to you. Magnificent sound, engineered to perfection. Crystal clear hands-free calling.',
                'price' => 399.00,
                'discount' => rand(55, 90),
                'image' => 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
            ],
            [
                'name' => 'Apple MacBook Pro 16-inch M3 Max',
                'description' => 'The most advanced Mac ever built for professionals. Featuring the revolutionary M3 Max chip for unprecedented performance.',
                'price' => 3499.00,
                'discount' => rand(55, 90),
                'image' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
            ],
            [
                'name' => 'Samsung Odyssey G9 Curved Gaming Monitor',
                'description' => '49-inch curved monitor with a 240Hz refresh rate and 1ms response time. The ultimate gaming immersion.',
                'price' => 1499.00,
                'discount' => rand(55, 90),
                'image' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
            ],
            [
                'name' => 'Nike Air Force 1 07 Sneakers',
                'description' => 'The radiance lives on in the Nike Air Force 1 07, the b-ball icon that puts a fresh spin on what you know best.',
                'price' => 110.00,
                'discount' => rand(55, 90),
                'image' => 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
            ],
            [
                'name' => 'Canon EOS R5 Mirrorless Camera',
                'description' => 'Professional full-frame mirrorless camera. 45 Megapixels, 8K video recording, and advanced autofocus.',
                'price' => 3899.00,
                'discount' => rand(55, 90),
                'image' => 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
            ],
            [
                'name' => 'Herman Miller Aeron Ergonomic Office Chair',
                'description' => 'The benchmark for ergonomic seating. Designed to support your body naturally across a wide range of postures.',
                'price' => 1200.00,
                'discount' => rand(55, 90),
                'image' => 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80',
            ],

            // 4 items with discount < 50
            [
                'name' => 'Apple AirPods Pro (2nd Generation)',
                'description' => 'Richer audio experience, next-level Active Noise Cancellation, and Adaptive Transparency. Up to 6 hours of listening time.',
                'price' => 249.00,
                'discount' => rand(10, 45),
                'image' => 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800&q=80',
            ],
            [
                'name' => 'Logitech MX Master 3S Wireless Mouse',
                'description' => 'Iconic mouse remastered. Now with Quiet Clicks and an 8K DPI track-on-glass sensor for ultimate precision.',
                'price' => 99.00,
                'discount' => rand(10, 45),
                'image' => 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
            ],
            [
                'name' => 'Dyson V15 Detect Cordless Vacuum',
                'description' => 'The most powerful, intelligent cordless vacuum. Reveals invisible dust and automatically adapts suction power.',
                'price' => 749.00,
                'discount' => rand(10, 45),
                'image' => 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80',
            ],
            [
                'name' => 'DJI Mini 3 Pro Drone',
                'description' => 'Mini-sized, mega-capable. Weighing less than 249g, featuring Tri-Directional Obstacle Sensing and 4K HDR video.',
                'price' => 759.00,
                'discount' => rand(10, 45),
                'image' => 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&q=80',
            ]
        ];

        foreach ($realProducts as $item) {
            $product = Product::create([
                'user_id' => $seller->id,
                'category_id' => $category->id,
                'name' => $item['name'],
                'slug' => Str::slug($item['name']) . '-' . time() . rand(10, 99),
                'description' => $item['description'],
                'price' => $item['price'],
                'stock' => rand(10, 150),
                'discount' => $item['discount'],
                'image_url' => $item['image'],
            ]);

            // Create the primary image record
            ProductImage::create([
                'product_id' => $product->id,
                'image_url' => $item['image'],
                'is_primary' => true,
                'sort_order' => 1,
            ]);
        }
    }
}
