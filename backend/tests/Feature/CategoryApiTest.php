<?php

namespace Tests\Feature;

use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_lists_all_categories_ordered_by_name(): void
    {
        Category::insert([
            ['name' => 'Zebra Gear'],
            ['name' => 'Accessories'],
            ['name' => 'Monitors'],
        ]);

        $response = $this->getJson('/api/categories');

        $response->assertStatus(200);
        $names = collect($response->json('categories'))->pluck('name')->all();

        $this->assertSame(['Accessories', 'Monitors', 'Zebra Gear'], $names);
    }

    public function test_it_returns_an_empty_list_when_no_categories_exist(): void
    {
        $response = $this->getJson('/api/categories');

        $response->assertStatus(200)
            ->assertJson(['categories' => []]);
    }
}
