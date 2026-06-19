<?php

namespace App\Http\Controllers;

use App\Models\ServiceRequest;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function myRequests(Request $request)
    {
        $requests = ServiceRequest::where('assigned_to', $request->user()->id)
            ->with('client:id,name,email')
            ->latest()
            ->get();

        return response()->json($requests);
    }

    public function updateStatus(Request $request, int $id)
    {
        $req = ServiceRequest::where('id', $id)
            ->where('assigned_to', $request->user()->id)
            ->firstOrFail();

        $data = $request->validate([
            'status' => 'required|in:in_progress,completed,cancelled',
        ]);

        $req->update(['status' => $data['status']]);

        return response()->json($req);
    }

    public function toggleStatus(Request $request)
    {
        $user = $request->user();
        $user->status = $user->status === 'online' ? 'offline' : 'online';
        $user->save();

        return response()->json(['status' => $user->status]);
    }
}
