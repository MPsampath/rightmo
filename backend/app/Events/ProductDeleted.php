<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class ProductDeleted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    public function __construct(public int $productId) {}

    public function broadcastOn(): array
    {
        return [new Channel('products')];
    }

    public function broadcastAs(): string
    {
        return 'ProductDeleted';
    }

    public function broadcastWith(): array
    {
        return ['id' => $this->productId];
    }
}
