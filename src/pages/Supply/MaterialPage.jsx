import React from 'react';
import BaseMaterialPage from './BaseMaterialPage';
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from '@/api/materials';

export default () => (
  <BaseMaterialPage
    title="Quản lý vật tư"
    idField="material_id"
    api={{ get: getMaterials, create: createMaterial, update: updateMaterial, remove: deleteMaterial }}
  />
);