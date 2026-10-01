<?php

namespace App\Services\Category;

use App\Models\Category;
use App\Http\Resources\CategoryResource;

class CategoryService
{
    public function getAllCategories()
    {
        $categories = Category::orderBy('name', 'asc')->get();
        return CategoryResource::collection($categories);
    }
}