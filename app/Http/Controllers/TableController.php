<?php

namespace App\Http\Controllers;

use App\Models\Table;
use Illuminate\Http\Request;

class TableController extends Controller
{
    public function index() { return Table::all(); }
    public function show($id) { return Table::findOrFail($id); }
    public function store(Request $request) {
        return Table::create($request->validate(['number'=>'required|integer','capacity'=>'required|integer|min:1']));
    }
    public function update(Request $request, $id) {
        $table = Table::findOrFail($id);
        $table->update($request->all());
        return $table;
    }
    public function destroy($id) { return Table::destroy($id); }
}
