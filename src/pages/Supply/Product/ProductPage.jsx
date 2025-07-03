import React from 'react';
import { Button, Tag } from 'antd';
import { Link } from 'react-router-dom';
import BaseMaterialPage from '../BaseMaterialPage';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/api/materials';
import { useNavigate } from 'react-router-dom';
const ProductPage = () => {
  const navigate = useNavigate(); // ✅ ĐÚNG VỊ TRÍ
  const handleViewBOM = (record) => {
    console.log('Xem BOM của:', record);

  };

  const customColumns = [
    {
      title: 'BOM',
      key: 'bom',
      render: (_, record) => (
        <Link
          type="default"
          to={`/boms/product/${record.product_id}`}
          onClick={(e) => e.stopPropagation()}>
          Xem BOM
        </Link>
      ),
    },
  ];

  return (
    <BaseMaterialPage
      title="Quản lý thành phẩm"
      idField="product_id"
      api={{ get: getProducts, create: createProduct, update: updateProduct, remove: deleteProduct }}
      customColumns={customColumns}
      onRow={(data) => ({
        onClick: () => navigate(`/supply/products/${data.product_id}`),
        style: { cursor: 'pointer' },
      })}
    />
  );
};

export default ProductPage;
