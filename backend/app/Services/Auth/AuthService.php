<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function register(array $data): array
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $token = Auth::guard('api')->login($user);

        if (!$token) {
            throw ValidationException::withMessages([
                'email' => ['Unauthorized. Incorrect email or password.'],
            ]);
        }

        return $this->respondWithToken($token);
    }

    public function login(array $credentials): array
    {
        $token = Auth::guard('api')->attempt($credentials);

        if (!$token) {
            throw ValidationException::withMessages([
                'email' => ['Unauthorized. Incorrect email or password.'],
            ]);
        }

        return $this->respondWithToken($token);
    }

    public function logout(): void
    {
        Auth::guard('api')->logout();
    }

    protected function respondWithToken(string $token ): array
    {
        $guard = Auth::guard('api');
        
        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
            'user' => $guard->user()
        ];
    }
}
