import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, Button, Tag } from 'antd';
import ProductTableLayout from '../../components/ProductTableLayout';

const tabs = [
  { label: 'Vật tư', key: 'materials', endpoint: '/api/v1/inventory/materials' },
  { label: 'Bán thành phẩm', key: 'semi-products', endpoint: '/api/v1/inventory/semi-products' },
  { label: 'Thành phẩm', key: 'products', endpoint: '/api/v1/inventory/products' },
];

const transformData = (data, type) => {
  return data.map((item) => {
    const base = type === 'materials' ? item.Material : item.Product;
    return {
      id: item.inventory_id,
      code: base.code,
      name: base.name,
      quantity: parseFloat(item.quantity),
      unit: base.unit || item.unit,
      warehouse: item.Warehouse?.name || 'N/A',
      status: base.status,
    };
  });
};

const InventoryStockPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (type) => {
    setLoading(true);
    try {
      const endpoint = tabs.find(t => t.key === type)?.endpoint;
      const response = await axios.get(`http://localhost:3030${endpoint}`);
      const transformed = transformData(response.data, type);
      setData(transformed);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(tabs[activeTab].key);
  }, [activeTab]);

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Mã', dataIndex: 'code' },
    { title: 'Tên', dataIndex: 'name' },
    { title: 'Số lượng', dataIndex: 'quantity' },
    { title: 'Đơn vị', dataIndex: 'unit' },
    { title: 'Kho', dataIndex: 'warehouse' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>{status}</Tag>
      ),
    },
    {
      title: 'Hành động',
      render: () => <Button type="link">Xem</Button>,
    },
  ];

  const filterByStatus = (value) => {
    if (value === 'all') {
      fetchData(tabs[activeTab].key);
    } else {
      setData(prev => prev.filter(item => item.status === value));
    }
  };

  return loading ? (
    <Spin tip="Đang tải dữ liệu..." />
  ) : (
    <ProductTableLayout
      title="Quản lý tồn kho"
      tabs={tabs.map(t => t.label)}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchPlaceholder="Tìm kiếm..."
      showAddButton={false}
      columns={columns}
      data={data}
      filters={[
        {
          defaultValue: 'Trạng thái',
          options: [
            { value: 'all', label: 'Tất cả' },
            { value: 'active', label: 'Hoạt động' },
            { value: 'inactive', label: 'Ngừng hoạt động' },
          ],
          onChange: filterByStatus,
        },
      ]}
    />
  );
};

export default InventoryStockPage;
