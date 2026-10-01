<?php

namespace App\Repositoryes\Product;

use App\Repositoryes\Product\ProductRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Product;

class ProductRepo implements ProductRepositoryInterface
{
    public function getAllProducts(array $filters, int $perPage = 10): LengthAwarePaginator
    {
        $query = Product::query()->with('category');
    
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['min_price']) && isset($filters['max_price'])) {
            $query->whereBetween('price', [$filters['min_price'], $filters['max_price']]);
        }

        if (!empty($filters['sort_by']) && in_array($filters['sort_by'], ['price', 'rating'])) {
            $direction = (isset($filters['sort_dir']) && $filters['sort_dir'] === 'desc') ? 'desc' : 'asc';
            $query->orderBy($filters['sort_by'], $direction);
        }

        return $query->paginate($perPage);
    }

    public function getProductById($id)
    {
        return Product::with('category')->find($id);
    }

    public function createProduct($data)
    {
        $product = Product::create($data);
        return $product->load('category');
    }

    public function updateProduct($id, $data)
    {
        $product = Product::find($id);
        if ($product) {
            $product->update($data);
        }
        return $product->load('category');
    }

    public function deleteProduct($id)
    {
        $product = Product::find($id);
        if ($product) {
            $product->delete();
        }
        return $product;
    }

    public function findByNameCategory($name)
    {
        return Product::where('name', $name)->where('category_id')->first();
    }
}
