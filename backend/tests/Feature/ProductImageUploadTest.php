<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Tests\TestCase;

class ProductImageUploadTest extends TestCase
{
    use RefreshDatabase;

    protected function authHeader(): array
    {
        $user = User::factory()->create();
        $token = JWTAuth::fromUser($user);

        return ['Authorization' => "Bearer {$token}"];
    }

    public function test_it_uploads_a_product_image_to_the_public_disk(): void
    {
        Storage::fake('public');

        $category = Category::create(['name' => 'Electronics']);
        $product = Product::factory()->create(['category_id' => $category->id, 'image_path' => null]);

        $file = UploadedFile::fake()->image('product.png');

        $response = $this->withHeaders($this->authHeader())
            ->postJson("/api/products/{$product->id}/image", ['image' => $file]);

        $response->assertStatus(200);

        $product->refresh();
        $this->assertNotNull($product->image_path);
        $this->assertTrue(Storage::disk('public')->exists($product->image_path));
    }

    public function test_it_replaces_the_old_image_when_uploading_a_new_one(): void
    {
        Storage::fake('public');

        $category = Category::create(['name' => 'Electronics']);
        $oldPath = UploadedFile::fake()->image('old.png')->store('product_images', 'public');
        $product = Product::factory()->create(['category_id' => $category->id, 'image_path' => $oldPath]);

        $newFile = UploadedFile::fake()->image('new.png');

        $this->withHeaders($this->authHeader())
            ->postJson("/api/products/{$product->id}/image", ['image' => $newFile])
            ->assertStatus(200);

        Storage::assertMissing($oldPath);
    }

    public function test_it_rejects_a_non_image_upload(): void
    {
        Storage::fake('public');

        $category = Category::create(['name' => 'Electronics']);
        $product = Product::factory()->create(['category_id' => $category->id]);

        $file = UploadedFile::fake()->create('document.pdf', 100);

        $response = $this->withHeaders($this->authHeader())
            ->postJson("/api/products/{$product->id}/image", ['image' => $file]);

        $response->assertStatus(500);
    }

    public function test_it_requires_authentication_to_upload_an_image(): void
    {
        Storage::fake('public');

        $category = Category::create(['name' => 'Electronics']);
        $product = Product::factory()->create(['category_id' => $category->id]);

        $file = UploadedFile::fake()->image('product.png');

        $response = $this->postJson("/api/products/{$product->id}/image", ['image' => $file]);

        $response->assertStatus(401);
    }
}
