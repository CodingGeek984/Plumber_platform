<?php

namespace App\Http\Controllers;

use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        $employees = User::where('role', 'employee');
        $requests = ServiceRequest::query();

        return response()->json([
            'employees_total' => (clone $employees)->count(),
            'employees_online' => (clone $employees)->where('status', 'online')->count(),
            'clients_total' => User::where('role', 'client')->count(),
            'requests_pending' => (clone $requests)->where('status', 'pending')->count(),
            'requests_in_progress' => (clone $requests)->where('status', 'in_progress')->count(),
            'requests_completed' => (clone $requests)->where('status', 'completed')->count(),
        ]);
    }

    public function users()
    {
        $users = User::where('role', '!=', 'admin')
            ->withCount(['serviceRequests', 'assignedRequests'])
            ->latest()
            ->get();

        return response()->json($users);
    }

    public function toggleStatus(int $id)
    {
        $user = User::where('id', $id)->where('role', 'employee')->firstOrFail();
        $user->status = $user->status === 'online' ? 'offline' : 'online';
        $user->save();

        return response()->json(['status' => $user->status]);
    }

    public function deleteUser(int $id)
    {
        $user = User::where('id', $id)->where('role', '!=', 'admin')->firstOrFail();
        $user->delete();

        return response()->json(['message' => 'Пользователь удалён']);
    }

    public function requests(Request $request)
    {
        $query = ServiceRequest::with(['client:id,name,email', 'employee:id,name'])
            ->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->get());
    }

    public function updateRequest(Request $request, int $id)
    {
        $req = ServiceRequest::findOrFail($id);

        $data = $request->validate([
            'status' => 'sometimes|in:pending,in_progress,completed,cancelled',
            'assigned_to' => 'sometimes|nullable|exists:users,id',
        ]);

        if (isset($data['assigned_to'])) {
            $emp = User::find($data['assigned_to']);
            $req->assigned_to = $emp?->id;
            $req->status = 'in_progress';
        }

        if (isset($data['status'])) {
            $req->status = $data['status'];
        }

        $req->save();

        return response()->json($req->load(['client:id,name', 'employee:id,name']));
    }

    public function assignRequest(Request $request, int $id)
    {
        $req = ServiceRequest::findOrFail($id);
        $data = $request->validate(['employee_id' => 'required|exists:users,id']);

        $emp = User::where('id', $data['employee_id'])->where('role', 'employee')->firstOrFail();
        $req->update(['assigned_to' => $emp->id, 'status' => 'in_progress']);

        return response()->json($req->load(['employee:id,name']));
    }
}
