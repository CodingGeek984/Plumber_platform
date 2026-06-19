<?php

namespace App\Http\Controllers;

use App\Models\ServiceRequest;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function myRequests(Request $request)
    {
        $requests = ServiceRequest::where('client_id', $request->user()->id)
            ->with('employee:id,name')
            ->latest()
            ->get();

        return response()->json($requests);
    }

    public function createRequest(Request $request)
    {
        $data = $request->validate([
            'service' => 'required|string|max:255',
            'client_phone' => 'required|string|max:20',
            'description' => 'nullable|string|max:2000',
        ]);

        $req = ServiceRequest::create([
            'client_id' => $request->user()->id,
            'client_name' => $request->user()->name,
            'client_phone' => $data['client_phone'],
            'service' => $data['service'],
            'description' => $data['description'] ?? null,
            'status' => 'pending',
            'assigned_to' => null,
        ]);

        return response()->json($req, 201);
    }
}
