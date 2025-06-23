import React from 'react';
import BaseMaterialPage from './BaseMaterialPage';
import { getSemiProducts, createSemiProduct, updateSemiProduct, deleteSemiProduct } from '@/api/materials';
import { get } from 'lodash-es';


export default () => (
  <BaseMaterialPage
    title="Quản lý bán thành phẩm"
    idField="semi_product_id"
    api={{ get: getSemiProducts, create: createSemiProduct, update: updateSemiProduct, remove: deleteSemiProduct }}
  />
);