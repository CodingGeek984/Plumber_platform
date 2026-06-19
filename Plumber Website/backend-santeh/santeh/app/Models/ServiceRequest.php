<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'client_name',
        'client_phone',
        'service',
        'description',
        'status',
        'assigned_to',
    ];

    protected $casts = [
        'client_id' => 'integer',
        'assigned_to' => 'integer',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function employee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
