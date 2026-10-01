<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    protected function authHeader(): array
    {
        $user = User::factory()->create();
        $token = JWTAuth::fromUser($user);

        return ['Authorization' => "Bearer {$token}"];
    }

    public function test_it_lists_products_with_pagination(): void
    {
        $category = Category::create(['name' => 'Electronics']);
        Product::factory()->count(3)->create(['category_id' => $category->id]);

        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data.data')
            ->assertJsonStructure(['data' => ['data', 'current_page', 'last_page', 'per_page', 'total']]);
    }

    public function test_it_filters_products_by_category(): void
    {
        $electronics = Category::create(['name' => 'Electronics']);
        $books = Category::create(['name' => 'Books']);

        Product::factory()->create(['name' => 'Laptop', 'category_id' => $electronics->id]);
        Product::factory()->create(['name' => 'Novel', 'category_id' => $books->id]);

        $response = $this->getJson('/api/products?category_id=' . $electronics->id);

        $response->assertStatus(200)->assertJsonCount(1, 'data.data');
        $this->assertSame('Laptop', $response->json('data.data.0.name'));
    }

    public function test_it_filters_products_by_price_range(): void
    {
        $category = Category::create(['name' => 'Electronics']);

        Product::factory()->create(['name' => 'Cheap', 'price' => 10, 'category_id' => $category->id]);
        Product::factory()->create(['name' => 'Mid', 'price' => 50, 'category_id' => $category->id]);
        Product::factory()->create(['name' => 'Expensive', 'price' => 500, 'category_id' => $category->id]);

        $response = $this->getJson('/api/products?min_price=20&max_price=100');

        $response->assertStatus(200)->assertJsonCount(1, 'data.data');
        $this->assertSame('Mid', $response->json('data.data.0.name'));
    }

    public function test_it_views_a_single_product_when_authenticated(): void
    {
        $category = Category::create(['name' => 'Electronics']);
        $product = Product::factory()->create(['category_id' => $category->id]);

        $response = $this->withHeaders($this->authHeader())
            ->getJson("/api/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $product->id)
            ->assertJsonPath('data.category.id', $category->id);
    }

    public function test_it_views_a_product_without_authentication(): void
    {
        $category = Category::create(['name' => 'Electronics']);
        $product = Product::factory()->create(['category_id' => $category->id]);

        $response = $this->getJson("/api/products/{$product->id}");

        $response->assertStatus(200);
    }

    public function test_it_creates_a_product_when_authenticated(): void
    {
        $category = Category::create(['name' => 'Electronics']);

        $response = $this->withHeaders($this->authHeader())
            ->postJson('/api/products', [
                'name' => 'New Gadget',
                'category_id' => $category->id,
                'price' => 99.99,
                'rating' => 4.5,
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'New Gadget');

        $this->assertDatabaseHas('products', [
            'name' => 'New Gadget',
            'category_id' => $category->id,
        ]);
    }

    public function test_it_rejects_creating_a_product_without_authentication(): void
    {
        $category = Category::create(['name' => 'Electronics']);

        $response = $this->postJson('/api/products', [
            'name' => 'New Gadget',
            'category_id' => $category->id,
            'price' => 99.99,
        ]);

        $response->assertStatus(401);
    }

    public function test_it_updates_a_product(): void
    {
        $category = Category::create(['name' => 'Electronics']);
        $product = Product::factory()->create(['category_id' => $category->id, 'price' => 10]);

        $response = $this->withHeaders($this->authHeader())
            ->putJson("/api/products/{$product->id}", ['price' => 150]);

        $response->assertStatus(200)->assertJsonPath('data.price', 150);
        $this->assertDatabaseHas('products', ['id' => $product->id, 'price' => 150]);
    }

    public function test_it_deletes_a_product(): void
    {
        $category = Category::create(['name' => 'Electronics']);
        $product = Product::factory()->create(['category_id' => $category->id]);

        $response = $this->withHeaders($this->authHeader())
            ->deleteJson("/api/products/{$product->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }
}
