<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductImage;
use Illuminate\Support\Str;

class UpdateTenProductsSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all()->keyBy('slug');
        if ($categories->isEmpty()) return;

        $items = [
            [
                'name' => 'Sony WH-1000XM5 Wireless Headphones',
                'description' => 'Industry-leading noise canceling with two processors and eight microphones. Magnificent sound, engineered to perfection. Up to 30-hour battery life.',
                'price' => 349.99,
                'slug' => Str::slug('Sony WH-1000XM5 Wireless Headphones'),
                'category_id' => $categories->get('electronics')?->id,
                'main_image' => 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
                'sub_images' => [
                    'https://images.unsplash.com/photo-1546435770-a3e426fa99f5?w=800&q=80',
                    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80'
                ]
            ],
            [
                'name' => 'Apple MacBook Pro 14-inch',
                'description' => 'Apple M2 Pro chip for a massive leap in CPU, GPU, and machine learning performance. Up to 18 hours of battery life. 14.2-inch Liquid Retina XDR display.',
                'price' => 1999.00,
                'slug' => Str::slug('Apple MacBook Pro 14-inch'),
                'category_id' => $categories->get('electronics')?->id,
                'main_image' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
                'sub_images' => [
                    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
                    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80'
                ]
            ],
            [
                'name' => 'Men\'s Classic Leather Jacket',
                'description' => 'A timeless classic. 100% genuine lambskin leather. Features a zip front, multiple pockets, and a sleek silhouette perfect for any occasion.',
                'price' => 189.50,
                'slug' => Str::slug('Mens Classic Leather Jacket'),
                'category_id' => $categories->get('fashion')?->id,
                'main_image' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
                'sub_images' => [
                    'https://images.unsplash.com/photo-1520975954732-57dd22299614?w=800&q=80'
                ]
            ],
            [
                'name' => 'Women\'s Summer Floral Dress',
                'description' => 'Lightweight and breathable. This elegant floral dress is perfect for warm summer days, beach trips, or casual outdoor parties.',
                'price' => 59.99,
                'slug' => Str::slug('Womens Summer Floral Dress'),
                'category_id' => $categories->get('fashion')?->id,
                'main_image' => 'https://images.unsplash.com/photo-1515347619362-7164b38378ee?w=800&q=80',
                'sub_images' => [
                    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80'
                ]
            ],
            [
                'name' => 'Minimalist Ceramic Coffee Mug',
                'description' => 'Handcrafted ceramic coffee mug with a matte finish. Holds 12oz of your favorite hot beverage. Dishwasher and microwave safe.',
                'price' => 24.00,
                'slug' => Str::slug('Minimalist Ceramic Coffee Mug'),
                'category_id' => $categories->get('home-living')?->id,
                'main_image' => 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
                'sub_images' => [
                    'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&q=80'
                ]
            ],
            [
                'name' => 'Pro Yoga Mat with Alignment Lines',
                'description' => 'Eco-friendly TPE yoga mat. Non-slip surface provides optimal grip and cushioning. Features laser-engraved alignment lines.',
                'price' => 45.00,
                'slug' => Str::slug('Pro Yoga Mat with Alignment Lines'),
                'category_id' => $categories->get('sports')?->id,
                'main_image' => 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
                'sub_images' => [
                    'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800&q=80'
                ]
            ],
            [
                'name' => 'The Midnight Library - Hardcover',
                'description' => 'A dazzling novel about all the choices that go into a life well lived, from the internationally bestselling author Matt Haig.',
                'price' => 21.50,
                'slug' => Str::slug('The Midnight Library Hardcover'),
                'category_id' => $categories->get('books')?->id,
                'main_image' => 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
                'sub_images' => [
                    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80'
                ]
            ],
            [
                'name' => 'Hydrating Facial Serum 30ml',
                'description' => 'Packed with Hyaluronic Acid and Vitamin C, this serum provides deep hydration while brightening the skin and reducing fine lines.',
                'price' => 38.00,
                'slug' => Str::slug('Hydrating Facial Serum 30ml'),
                'category_id' => $categories->get('beauty')?->id,
                'main_image' => 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
                'sub_images' => [
                    'https://images.unsplash.com/photo-1608248593802-808ca1b968fc?w=800&q=80'
                ]
            ],
            [
                'name' => 'Organic Arabica Coffee Beans 1kg',
                'description' => 'Premium whole bean coffee. Medium roast with notes of chocolate and caramel. Sourced ethically and roasted to perfection.',
                'price' => 29.99,
                'slug' => Str::slug('Organic Arabica Coffee Beans 1kg'),
                'category_id' => $categories->get('food-beverages')?->id,
                'main_image' => 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=800&q=80',
                'sub_images' => [
                    'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?w=800&q=80'
                ]
            ],
            [
                'name' => 'Lego Star Wars Millennium Falcon',
                'description' => 'Defeat the evil Empire with the Millennium Falcon! Features intricate exterior details, upper and lower quad laser cannons, and 7 minifigures.',
                'price' => 159.99,
                'slug' => Str::slug('Lego Star Wars Millennium Falcon'),
                'category_id' => $categories->get('toys-hobbies')?->id,
                'main_image' => 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80',
                'sub_images' => [
                    'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80' // Using same for placeholder
                ]
            ],
        ];

        // Fetch the first 10 products
        $products = Product::orderBy('id', 'asc')->take(10)->get();

        foreach ($products as $index => $product) {
            if (!isset($items[$index])) break;
            
            $item = $items[$index];

            // Update main product details
            $product->update([
                'name' => $item['name'],
                'description' => $item['description'],
                'price' => $item['price'],
                'slug' => $item['slug'],
                'category_id' => $item['category_id'] ?? $product->category_id,
                'image_url' => $item['main_image'],
            ]);

            // Clear old images
            ProductImage::where('product_id', $product->id)->delete();

            // Insert new main image as primary
            ProductImage::create([
                'product_id' => $product->id,
                'image_url' => $item['main_image'],
                'is_primary' => true,
                'sort_order' => 0,
            ]);

            // Insert sub images
            foreach ($item['sub_images'] as $subIndex => $subImage) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => $subImage,
                    'is_primary' => false,
                    'sort_order' => $subIndex + 1,
                ]);
            }
        }
    }
}
