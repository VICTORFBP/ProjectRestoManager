<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index()
    {
        return Customer::all();
    }

    public function show($id)
    {
        return Customer::findOrFail($id);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name'  => 'required|string|max:100',
            'email'      => 'nullable|email|unique:customers,email',
            'phone'      => 'nullable|string|max:15',
            'loyalty_points' => 'nullable|integer|min:0',
        ]);
        return Customer::create($data);
    }

    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);
        $customer->update($request->all());
        return $customer;
    }

    public function destroy($id)
    {
        return Customer::destroy($id);
    }
}
