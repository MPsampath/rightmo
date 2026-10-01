<?php

namespace App\Events;

use App\Models\Product;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class ProductCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    public function __construct(public Product $product) {}

    public function broadcastOn(): array
    {
        return [new Channel('products')];
    }

    public function broadcastAs(): string
    {
        return 'ProductCreated';
    }

    public function broadcastWith(): array
    {
        return ['product' => $this->product->toArray()];
    }
}
