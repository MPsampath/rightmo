<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterUserRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Traits\ApiResponser;
use App\Services\Auth\AuthService;

class AuthController extends Controller
{
    use ApiResponser;
    public function __construct(protected AuthService $authService) {}

    public function register(RegisterUserRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();

            $user = $this->authService->register($data);

            return $this->successResponse($user, 'User registered successfully.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function login(Request $request): JsonResponse
    {
        try {
            $credentials = $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            $tokenData = $this->authService->login($credentials);

            return $this->successResponse($tokenData, 'User logged in successfully.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function logout(): JsonResponse
    {
        try {
            $this->authService->logout();

            return $this->successResponse(null, 'Successfully logged out.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function me(): JsonResponse
    {
        try {
            $user = auth()->guard('api')->user();
            return $this->successResponse($user, 'User details retrieved successfully.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }
}
