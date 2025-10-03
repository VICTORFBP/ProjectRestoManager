<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * El namespace que se aplicará a tus controladores.
     *
     * Laravel 8+ ya no lo usa por defecto, pero puedes dejarlo vacío
     * si usas imports con `::class` en tus rutas.
     */
    public const HOME = '/';

    /**
     * Registra las rutas de la aplicación.
     */
    public function boot(): void
    {
        $this->routes(function () {
            // Rutas de la API
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            // Rutas web
            if (file_exists(base_path('routes/web.php'))) {
                Route::middleware('web')
                    ->group(base_path('routes/web.php'));
            }
        });
    }
}
