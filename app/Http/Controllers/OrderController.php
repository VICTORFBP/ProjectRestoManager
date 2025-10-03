<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MenuItem;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Listar todos los pedidos
     */
    public function index()
    {
        $orders = Order::with(['customer','user','items.menuItem'])->get();
        return response()->json($orders);
    }

    /**
     * Mostrar un pedido específico
     */
    public function show($id)
    {
        $order = Order::with(['customer','user','items.menuItem'])->findOrFail($id);
        return response()->json($order);
    }

    /**
     * Crear un nuevo pedido
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'table_id'    => 'nullable|exists:tables,id',
            'user_id'     => 'nullable|exists:users,id',
            'status'      => 'nullable|in:pendiente,servido,completado,cancelado',
            'notes'       => 'nullable|string',
            'items'       => 'required|array',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity'     => 'required|integer|min:1',
            'items.*.special_instructions' => 'nullable|string',
        ]);

        // Crear pedido
        $order = Order::create([
            'customer_id' => $data['customer_id'] ?? null,
            'table_id'    => $data['table_id'] ?? null,
            'user_id'     => $data['user_id'] ?? null,
            'status'      => $data['status'] ?? 'pendiente',
            'total'       => 0,
            'notes'       => $data['notes'] ?? null,
        ]);

        $total = 0;

        foreach ($data['items'] as $itemData) {
            $menuItem = MenuItem::findOrFail($itemData['menu_item_id']);
            $subtotal = $menuItem->price * $itemData['quantity'];

            $order->items()->create([
                'menu_item_id' => $menuItem->id,
                'quantity'     => $itemData['quantity'],
                'unit_price'   => $menuItem->price,
                'subtotal'     => $subtotal,
                'special_instructions' => $itemData['special_instructions'] ?? null,
                'status'       => 'pendiente',
            ]);

            $total += $subtotal;
        }

        $order->update(['total' => $total]);

        return response()->json($order->load('items.menuItem'), 201);
    }

    /**
     * Actualizar un pedido
     */
    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $data = $request->validate([
            'status' => 'nullable|in:pendiente,servido,completado,cancelado',
            'notes'  => 'nullable|string',
        ]);

        $order->update($data);

        return response()->json($order->load('items.menuItem'));
    }

    /**
     * Eliminar un pedido
     */
    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();

        return response()->json(['message' => 'Pedido eliminado correctamente']);
    }
}
