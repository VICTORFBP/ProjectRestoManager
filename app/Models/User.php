<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'username',
        'email',
        'password',
        'first_name',
        'last_name',
        'role_id',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'user_id');
    }

    // Helper para verificar roles
    public function hasRole($roleName)
    {
        return $this->role && strtolower($this->role->name) === strtolower($roleName);
    }

    public function isAdmin()
    {
        return $this->hasRole('Administrador');
    }

    public function isMesero()
    {
        return $this->hasRole('Mesero');
    }

    public function isCliente()
    {
        return $this->hasRole('Cliente');
    }
}