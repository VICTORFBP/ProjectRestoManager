<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index() { return User::with('role')->get(); }
    public function show($id) { return User::with('role')->findOrFail($id); }
    public function store(Request $request) {
        $data = $request->validate([
            'username'   => 'required|string|unique:users,username',
            'first_name' => 'required|string|max:100',
            'last_name'  => 'required|string|max:100',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|string|min:6',
            'role_id'    => 'required|exists:roles,id',
        ]);
        $data['password'] = bcrypt($data['password']);
        return User::create($data);
    }
    public function update(Request $request, $id) {
        $user = User::findOrFail($id);
        $data = $request->all();
        if(isset($data['password'])) $data['password'] = bcrypt($data['password']);
        $user->update($data);
        return $user;
    }
    public function destroy($id) { return User::destroy($id); }
}
