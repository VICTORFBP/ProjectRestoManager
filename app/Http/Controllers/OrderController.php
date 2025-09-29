<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        // Trae pedidos junto con cliente y usuario
        $orders = \App\Models\Order::with(['customer','user','items.menuItem'])->get();
        return view('orders.index', compact('orders'));
    }
}
