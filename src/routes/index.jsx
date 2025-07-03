import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import DashboardPage from '../pages/DashboardPage';
import ManufacturingPlansPage from '../pages/Manufacturing/Manufacturing Plan/ManufacturingPlansPage';
import ManufacturingOrdersPage from '../pages/Manufacturing/Manufacturing Order/ManufacturingOrdersPage';
import ManufacturingStepsPage from '../pages/ManufacturingStepsPage';
import ManufacturingWorkOrdersPage from '../pages/Manufacturing/Work Order/ManufacturingWorkOrdersPage';
import InventoryWarehousesPage from '../pages/Inventory/InventoryWarehousesPage';
import InventoryStockPage from '../pages/Inventory/InventoryStockPage';
import InventoryTransactionsPage from '../pages/Inventory/InventoryTransactionsPage';
import InventoryHistoryPage from '../pages/Inventory/InventoryHistoryPage';
import ProductsFinishedPage from '../pages/ProductsFinishedPage';
import ProductsSemiPage from '../pages/ProductsSemiPage';
import ProductsMaterialsPage from '../pages/ProductsMaterialsPage';
import BomsProductsPage from '../pages/Bom/BomsProductsPage';
import BomsSemiProductsPage from '../pages/BomsSemiProductsPage';
import UsersPage from '../pages/UsersPage';
import ReportsProductionPage from '../pages/ReportsProductionPage';
import ReportsInventoryPage from '../pages/ReportsInventoryPage';
import ManufacturingOrderDetailPage from '../pages/Manufacturing/Manufacturing Order/ManufacturingOrderDetailPage';
import ManufacturingPlanDetailPage from '../pages/Manufacturing/Manufacturing Plan/ManufacturingPlanDetailPage';
import ManufacturingWorkOrderDetailPage from '../pages/Manufacturing/Work Order/ManufacturingWorkOrderDetailPage';
import MaterialPage from '../pages/Supply/Material/MaterialPage';
import SemiProductPage from '../pages/Supply/SemiProductPage';
import ProductPage from '../pages/Supply/Product/ProductPage';
import BomsProductDetailsPage from '../pages/Bom/BomsProductDetailsPage';
import MaterialDetailPage from '../pages/Supply/Material/MaterialDetailPage';
import ProductDetailPage from '../pages/Supply/Product/ProductDetailPage';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="manufacturing/plans" element={<ManufacturingPlansPage />} />
        <Route path="manufacturing/orders" element={<ManufacturingOrdersPage />} />
        <Route path="manufacturing/steps" element={<ManufacturingStepsPage />} />
        <Route path="manufacturing/work-orders" element={<ManufacturingWorkOrdersPage />} />
        <Route path="manufacturing-work-orders/:id" element={<ManufacturingWorkOrderDetailPage />} />
        <Route path="inventory/warehouses" element={<InventoryWarehousesPage />} />
        <Route path="inventory/stock" element={<InventoryStockPage />} />
        <Route path="inventory/transactions" element={<InventoryTransactionsPage />} />
        <Route path="inventory/history" element={<InventoryHistoryPage />} />
        <Route path="supply/products" element={<ProductPage />} />
        <Route path="supply/products/:product_id" element={<ProductDetailPage />} />
        <Route path="supply/materials" element={<MaterialPage />} />
        <Route path="supply/materials/:material_id" element={<MaterialDetailPage />} />
        <Route path="supply/semi-products" element={<SemiProductPage />} />
        <Route path="material" element={<MaterialPage />} />
        <Route path="manufacturing-orders" element={<ManufacturingOrdersPage />} />
        <Route path="manufacturing-orders/:id" element={<ManufacturingOrderDetailPage />} />
        <Route path="products/finished" element={<ProductsFinishedPage />} />
        <Route path="products/semi" element={<ProductsSemiPage />} />
        <Route path="products/materials" element={<ProductsMaterialsPage />} />
        <Route path="boms/product" element={<BomsProductsPage />} />
        <Route path="boms/product/:id" element={<BomsProductDetailsPage />} />
        <Route path="boms/semi-products" element={<BomsSemiProductsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="reports/production" element={<ReportsProductionPage />} />
        <Route path="reports/inventory" element={<ReportsInventoryPage />} />
        <Route path="manufacturing/plans/:id" element={<ManufacturingPlanDetailPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 