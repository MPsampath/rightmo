<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Events\ProductCreated;
use App\Events\ProductUpdated;
use App\Events\ProductDeleted;
use Illuminate\Http\Request;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;

class ProductController extends Controller
{
    use \App\Traits\ApiResponser;
    public function __construct(protected \App\Services\Product\ProductService $productService) {}
    public function list(Request $request)
    {
        try {
            $filters = $request->only(['search', 'category_id', 'min_price', 'max_price', 'sort_by', 'sort_dir']);
            $products = $this->productService->getAllProducts($filters);
            return $this->successResponse($products, 'Products retrieved successfully.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function view($id)
    {
        try {
            $product = $this->productService->getProductById($id);
            return $this->successResponse($product, 'Product retrieved successfully.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function store(StoreProductRequest $request)
    {
        try {
            $product = $this->productService->createProduct($request->all());
            // broadcast(new ProductCreated($product->resource));
            return $this->successResponse($product, 'Product created successfully.', 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(UpdateProductRequest $request, $id)
    {
        try {
            $product = $this->productService->updateProduct($id, $request->all());
            // broadcast(new ProductUpdated($product->resource));
            return $this->successResponse($product, 'Product updated successfully.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function delete($id)
    {
        try {
            $result = $this->productService->deleteProduct($id);
            // broadcast(new ProductDeleted((int) $id));
            return $this->successResponse($result, 'Product deleted successfully.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
    public function uploadImage(Request $request, $id)
    {
        try {
            $request->validate(['image' => 'required|image|max:5120']);
            $image = $this->productService->uploadProductImage($id, $request->file('image'));
            // broadcast(new ProductUpdated($image->resource));
            return $this->successResponse($image, 'Product image uploaded successfully.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
