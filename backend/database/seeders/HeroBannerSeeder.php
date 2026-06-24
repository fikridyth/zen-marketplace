<?php

namespace Database\Seeders;

use App\Models\HeroBanner;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HeroBannerSeeder extends Seeder
{
    /**
     * Seed the hero_banners table.
     */
    public function run(): void
    {
        $banners = [
            [
                'image_url' => 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&h=600&fit=crop&q=80',
                'link' => '/products',
                'title' => 'Summer Collection 2026',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'image_url' => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=600&fit=crop&q=80',
                'link' => '/products?category=electronics',
                'title' => 'Tech Deals Up to 50% Off',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'image_url' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop&q=80',
                'link' => '/products?category=fashion',
                'title' => 'New Fashion Arrivals',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'image_url' => 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1920&h=600&fit=crop&q=80',
                'link' => '/products',
                'title' => 'Shop the Best Brands',
                'is_active' => true,
                'sort_order' => 4,
            ],
        ];

        foreach ($banners as $banner) {
            HeroBanner::firstOrCreate(
                ['title' => $banner['title']],
                $banner
            );
        }
    }
}
