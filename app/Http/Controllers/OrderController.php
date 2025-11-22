<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\MenuItem;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        return Order::with(['customer','user','table','items.menuItem'])->get();
    }

    public function show($id)
    {
        return Order::with(['customer','user','table','items.menuItem'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'table_id'    => 'nullable|exists:tables,id',
            'user_id'     => 'nullable|exists:users,id',
            'status'      => 'nullable|in:pendiente,servido,completado,cancelado',
            'notes'       => 'nullable|string',
            'items'       => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity'     => 'required|integer|min:1',
            'items.*.special_instructions' => 'nullable|string',
        ]);

        $order = Order::create([
            'customer_id' => $data['customer_id'] ?? null,
            'table_id'    => $data['table_id'] ?? null,
            'user_id'     => $data['user_id'] ?? auth()->id(),
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

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $data = $request->validate([
            'status' => 'nullable|in:pendiente,servido,completado,cancelado',
            'notes'  => 'nullable|string',
            'table_id' => 'nullable|exists:tables,id',
            'customer_id' => 'nullable|exists:customers,id',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $order->update($data);

        return response()->json($order->load('items.menuItem'));
    }

    public function destroy($id)
    {
        Order::findOrFail($id)->delete();

        return response()->json(['message' => 'Pedido eliminado correctamente']);
    }

    /**
     * Obtener pedidos del cliente autenticado
     */
    public function myOrders(Request $request)
    {
        $userId = $request->user()->id;
        
        $orders = Order::with(['customer','user','table','items.menuItem'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }
}