<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Http\Request;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException;
use Symfony\Component\HttpFoundation\Response;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // Attempt to parse the token and authenticate the user
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }
        } catch (Exception $e) {
            // Handle specific JWT exceptions with custom messages
            if ($e instanceof TokenInvalidException) {
                return response()->json(['error' => 'Token is invalid. Please log in again.'], 401);
            }

            if ($e instanceof TokenExpiredException) {
                return response()->json(['error' => 'Token has expired. Please refresh or log in again.'], 401);
            }

            // Catch all for missing token or other JWT errors
            return response()->json(['error' => 'Authorization token not found or missing.'], 401);
        }

        return $next($request);
    }
}
