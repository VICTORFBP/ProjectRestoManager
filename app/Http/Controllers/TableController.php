<?php

namespace App\Http\Controllers;

use App\Models\Table;
use Illuminate\Http\Request;

class TableController extends Controller
{
    /**
     * Mostrar todas las mesas.
     */
    public function index()
    {
        return response()->json(Table::all(), 200);
    }

    /**
     * Crear una nueva mesa.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:tables,name',
            'seats' => 'required|integer|min:1',
            'status' => 'in:disponible,ocupada,reservada',
        ]);

        $table = Table::create($validated);

        return response()->json([
            'message' => 'Mesa creada exitosamente',
            'table' => $table,
        ], 201);
    }

    /**
     * Mostrar una mesa específica.
     */
    public function show(Table $table)
    {
        return response()->json($table, 200);
    }

    /**
     * Actualizar una mesa.
     */
    public function update(Request $request, Table $table)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|unique:tables,name,' . $table->id,
            'seats' => 'sometimes|integer|min:1',
            'status' => 'sometimes|in:disponible,ocupada,reservada',
        ]);

        $table->update($validated);

        return response()->json([
            'message' => 'Mesa actualizada correctamente',
            'table' => $table,
        ], 200);
    }

    /**
     * Eliminar una mesa.
     */
    public function destroy(Table $table)
    {
        $table->delete();

        return response()->json(['message' => 'Mesa eliminada correctamente'], 200);
    }
}
