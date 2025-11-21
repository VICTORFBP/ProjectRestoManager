<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    public function index()
    {
        return MenuItem::with('category')->get();
    }

    public function show($id)
    {
        return MenuItem::with('category')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:100',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
        ]);
        return MenuItem::create($data);
    }

    public function update(Request $request, $id)
    {
        $item = MenuItem::findOrFail($id);
        $item->update($request->all());
        return $item;
    }

    public function destroy($id)
    {
        return MenuItem::destroy($id);
    }
}
