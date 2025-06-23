import React from 'react';
import BaseMaterialPage from './BaseMaterialPage';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/api/materials';

export default () => (
  <BaseMaterialPage
    title="Quản lý thành phẩm"
    idField="product_id"
    api={{ get: getProducts, create: createProduct, update: updateProduct, remove: deleteProduct }}
  />
);