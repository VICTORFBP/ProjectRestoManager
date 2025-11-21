import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Dashboard from "../pages/Dashboard";

// MENU ITEMS
import { MenuList, MenuCreate, MenuEdit } from "../pages/MenuItems";

// ORDERS
import { OrderList, OrderCreate, OrderEdit } from "../pages/Orders";

// TABLES
import { TableList, TableCreate, TableEdit } from "../pages/Tables";

// USERS
import { UserList, UserCreate, UserEdit } from "../pages/Users";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>

          {/* DASHBOARD */}
          <Route path="/" element={<Dashboard />} />

          {/* MENU ITEMS */}
          <Route path="/menu-items" element={<MenuList />} />
          <Route path="/menu-items/create" element={<MenuCreate />} />
          <Route path="/menu-items/edit/:id" element={<MenuEdit />} />

          {/* ORDERS */}
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/create" element={<OrderCreate />} />
          <Route path="/orders/edit/:id" element={<OrderEdit />} />

          {/* TABLES */}
          <Route path="/tables" element={<TableList />} />
          <Route path="/tables/create" element={<TableCreate />} />
          <Route path="/tables/edit/:id" element={<TableEdit />} />

          {/* USERS */}
          <Route path="/users" element={<UserList />} />
          <Route path="/users/create" element={<UserCreate />} />
          <Route path="/users/edit/:id" element={<UserEdit />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}