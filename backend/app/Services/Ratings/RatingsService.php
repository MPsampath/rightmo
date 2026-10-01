<?php
namespace App\Services\Ratings;

use App\Models\Rating;
use App\Jobs\UpdateProductRating;

class RatingsService
{
    public function createRating($productId, $ratingValue)
    {
        $rating = new Rating();
        $rating->product_id = $productId;
        $rating->rating = $ratingValue;
        $rating->save();
        
        $rating->load('product');
        
        // Dispatch a job to update the product's average rating
        UpdateProductRating::dispatch($rating->product);

        return $rating;
    }
}
