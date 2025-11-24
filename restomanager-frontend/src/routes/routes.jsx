import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";

// Auth
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// Admin/Mesero
import Dashboard from "../pages/Dashboard";
import { MenuList, MenuCreate, MenuEdit } from "../pages/MenuItems";
import { OrderList, OrderCreate, OrderEdit } from "../pages/Orders";
import { TableList, TableCreate, TableEdit } from "../pages/Tables";
import { UserList, UserCreate, UserEdit } from "../pages/Users";

// Cliente
import MenuCliente from "../pages/Cliente/MenuCliente";
import PedidosCliente from "../pages/Cliente/PedidosCliente";
import Carrito from "../pages/Cliente/Carrito";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* DASHBOARD - Solo Admin */}
            <Route
              path="/"
              element={
                <ProtectedRoute roles={["Administrador"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* MENU ITEMS - Solo Admin */}
            <Route
              path="/menu-items"
              element={
                <ProtectedRoute roles={["Administrador"]}>
                  <MenuList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/menu-items/create"
              element={
                <ProtectedRoute roles={["Administrador"]}>
                  <MenuCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/menu-items/edit/:id"
              element={
                <ProtectedRoute roles={["Administrador"]}>
                  <MenuEdit />
                </ProtectedRoute>
              }
            />

            {/* ORDERS - Admin y Mesero */}
            <Route
              path="/orders"
              element={
                <ProtectedRoute roles={["Administrador", "Mesero"]}>
                  <OrderList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/create"
              element={
                <ProtectedRoute roles={["Administrador", "Mesero"]}>
                  <OrderCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/edit/:id"
              element={
                <ProtectedRoute roles={["Administrador", "Mesero"]}>
                  <OrderEdit />
                </ProtectedRoute>
              }
            />

            {/* TABLES - Solo Admin */}
            <Route
              path="/tables"
              element={
                <ProtectedRoute roles={["Administrador"]}>
                  <TableList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tables/create"
              element={
                <ProtectedRoute roles={["Administrador"]}>
                  <TableCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tables/edit/:id"
              element={
                <ProtectedRoute roles={["Administrador"]}>
                  <TableEdit />
                </ProtectedRoute>
              }
            />

            {/* USERS - Solo Admin */}
            <Route
              path="/users"
              element={
                <ProtectedRoute roles={["Administrador"]}>
                  <UserList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/create"
              element={
                <ProtectedRoute roles={["Administrador"]}>
                  <UserCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/edit/:id"
              element={
                <ProtectedRoute roles={["Administrador"]}>
                  <UserEdit />
                </ProtectedRoute>
              }
            />

            {/* CLIENTE - Ver menú, carrito y pedidos */}
            <Route
              path="/menu"
              element={
                <ProtectedRoute roles={["Cliente"]}>
                  <MenuCliente />
                </ProtectedRoute>
              }
            />
            <Route
              path="/carrito"
              element={
                <ProtectedRoute roles={["Cliente"]}>
                  <Carrito />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute roles={["Cliente"]}>
                  <PedidosCliente />
                </ProtectedRoute>
              }
            />

            {/* Fallback simple */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}