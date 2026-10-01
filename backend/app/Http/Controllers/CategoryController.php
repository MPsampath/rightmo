<?php

namespace App\Http\Controllers;

use App\Services\Category\CategoryService;
use App\Traits\ApiResponser;

class CategoryController extends Controller
{
    use ApiResponser;

    public function __construct(protected CategoryService $categoryService){}

    public function all()
    {
        try {
            $categories = $this->categoryService->getAllCategories();

            return $this->successResponse($categories, 'Categories retrieved successfully.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
