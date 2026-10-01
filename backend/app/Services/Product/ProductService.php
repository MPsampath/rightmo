<?php

namespace App\Services\Product;

use App\Helpers\FileHandling;
use App\Repositoryes\Product\ProductRepositoryInterface;
use App\Http\Resources\ProductResource;
use Exception;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    
    public function __construct(protected ProductRepositoryInterface $productRepository) {}
    public function getAllProducts(array $filters, int $perPage = 10)
    {

        $products = $this->productRepository->getAllProducts($filters, $perPage);
        return ProductResource::collection($products);
    }

    public function getProductById($id)
    {
        return new ProductResource($this->productRepository->getProductById($id));
    }

    public function createProduct($data)
    {

        $product = $this->productRepository->findByNameCategory($data['name'] ?? '');
        if ($product) {
            throw new Exception('Product with this name already exists.');
        }
        $data['category_id'] = $data['category_id'] ?? 0;
        
        return new ProductResource($this->productRepository->createProduct($data));
    }

    public function updateProduct($id, $data)
    {
        $existingProduct = $this->productRepository->findByNameCategory($data['name'] ?? '');
        if ($existingProduct && $existingProduct->id !== $id) {
            throw new Exception('Product with this name already exists.');
        }
        
        return new ProductResource($this->productRepository->updateProduct($id, $data));
    }

    public function deleteProduct($id)
    {
        $product = $this->productRepository->getProductById($id);
        if (!$product) {
            throw new Exception('Product not found.');
        }

        if ($product->image_path) {
            FileHandling::deleteFile($product->image_path);
        }

        return new ProductResource($this->productRepository->deleteProduct($id));
    }

    public function uploadProductImage($id, $image)
    {
        $product = $this->productRepository->getProductById($id);
        if (!$product) {
            throw new Exception('Product not found.');
        }
        
        $oldFilePath = $product->image_path;
        
        if (!$image) {
            throw new Exception('No image provided.');
        }

        $imagePath = FileHandling::uploadFile($image, 'product_images', $oldFilePath);
        
        if (!$product) {
            throw new Exception('Product not found.');
        }

        $data = ['image_path' => $imagePath];
        return new ProductResource($this->productRepository->updateProduct($id, $data));
    }
}
