import React from 'react';
import { Table, Button, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const ProductsFinishedPage = () => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />}>Sửa</Button>
          <Button danger icon={<DeleteOutlined />}>Xóa</Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      id: '1',
      name: 'Sản phẩm 1',
      description: 'Mô tả sản phẩm 1',
      price: 100,
    },
    {
      key: '2',
      id: '2',
      name: 'Sản phẩm 2',
      description: 'Mô tả sản phẩm 2',
      price: 200,
    },
  ];

  return (
    <div>
      <h1>Thành phẩm</h1>
      <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
        Thêm sản phẩm
      </Button>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default ProductsFinishedPage; 