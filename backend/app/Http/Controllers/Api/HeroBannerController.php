<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeroBanner;
use Illuminate\Http\JsonResponse;

class HeroBannerController extends Controller
{
    /**
     * List all active hero banners (public).
     */
    public function index(): JsonResponse
    {
        $banners = HeroBanner::active()
            ->orderBy('sort_order')
            ->get();

        return response()->json($banners);
    }
}
