<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Неавторизован'], 401);
        }

        if (($user->role ?? null) !== $role) {
            return response()->json(['message' => 'Доступ запрещён'], 403);
        }

        return $next($request);
    }
}
