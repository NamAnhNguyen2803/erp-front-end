import React from 'react';
import BaseMaterialPage from '../BaseMaterialPage';
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from '@/api/materials';
import { useNavigate } from 'react-router-dom';

const MaterialPage = () => {
  const navigate = useNavigate(); // ✅ ĐÚNG VỊ TRÍ

  return (
    <BaseMaterialPage
      title="Quản lý vật tư"
      idField="material_id"
      api={{ get: getMaterials, create: createMaterial, update: updateMaterial, remove: deleteMaterial }}
      onRow={(data) => ({
        onClick: () => navigate(`/supply/materials/${data.material_id || data.id}`),
        style: { cursor: 'pointer' },
      })}
    />
  );
};

export default MaterialPage;
