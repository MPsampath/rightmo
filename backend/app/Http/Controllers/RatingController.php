<?php

namespace App\Http\Controllers;

use App\Services\Ratings\RatingsService;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    public function store(Request $request, $id)
    {
        try {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $rating = (new RatingsService())->createRating($id, $request->input('rating'));

        return response()->json($rating, 201);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
    }
}
