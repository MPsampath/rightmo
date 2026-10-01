<?php

namespace App\Repositoryes\Product;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProductRepositoryInterface
{
    public function getAllProducts(array $filters, int $perPage = 10) : LengthAwarePaginator;

    public function getProductById($id);

    public function createProduct($data);

    public function updateProduct($id, $data);

    public function deleteProduct($id);

    public function findByNameCategory($name);
}