import React, { useEffect, useState } from 'react';
import { Button, Select, Pagination, Modal } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import InventoryTableLayout from '../../layouts/InventoryLayout';
import { transactionTypeMap, itemTypeMap } from '../../constants/transactionType.enum';
import InventoryTransactionForm from './InventoryTransactionForm';

const { Option } = Select;

const InventoryTransactionsPage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // State mới để lưu pageSize
  const [total, setTotal] = useState(0); // State để lưu tổng số giao dịch từ API
  const [formData, setFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);
  const handleSubmit = (data) => {
    console.log('Submit:', data);
    setIsModalOpen(false);
    fetchTransactions(); // Làm mới danh sách sau khi submit
  };

  const fetchTransactions = async (page = 1, limit = pageSize) => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3030/api/v1/transactions/all', {
        params: {
          page,
          limit,
          warehouse_id: selectedWarehouse,
          item_type: selectedItemType,
        },
      });

      const raw = res.data.transactions.map((item) => ({
        key: item.transaction_id,
        code: item.item_id || '',
        name: item.item_name || '',
        unit: item.item_details?.unit || '',
        quantity: item.quantity,
        warehouse: item.ToWarehouse?.name || '',
        transactionDate: item.transaction_date,
        itemType: item.item_type,
        transactionType: item.transaction_type,
        fromWarehouse: item.FromWarehouse?.name || '',
        toWarehouse: item.ToWarehouse?.name || '',
      }));

      setData(raw);
      setFilteredData(raw);
      setTotal(res.data.total); // Lấy tổng số giao dịch từ API
      extractFilters(raw);
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    }
    setLoading(false);
  };

  const extractFilters = (data) => {
    const warehouseSet = new Set();
    const typeSet = new Set();

    data.forEach((item) => {
      if (item.warehouse) warehouseSet.add(item.warehouse);
      if (item.itemType) typeSet.add(item.itemType);
    });

    setWarehouses([...warehouseSet]);
    setItemTypes([...typeSet]);
  };

  const handleFilter = () => {
    fetchTransactions(1, pageSize); // Gọi lại API với bộ lọc và pageSize hiện tại
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedWarehouse(null);
    setSelectedItemType(null);
    fetchTransactions(1, pageSize); // Gọi lại API với pageSize hiện tại
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi pageSize
    fetchTransactions(1, value); // Gọi API với pageSize mới
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const columns = [
    {
      title: 'Mã vật tư',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Tên vật tư',
      dataIndex: 'name',
      key: 'name',
    },    
    {
      title: 'Loại vật tư',
      dataIndex: 'itemType',
      key: 'itemType',
      render: (value) => itemTypeMap[value] || value,
    },
    {
      title: 'Loại giao dịch',
      dataIndex: 'transactionType',
      key: 'transactionType',
      render: (value) => transactionTypeMap[value] || value,
    },
    {
      title: 'Từ kho',
      dataIndex: 'fromWarehouse',
      key: 'fromWarehouse',
      render: (text) => text || '-',
    },
    {
      title: 'Đến kho',
      dataIndex: 'toWarehouse',
      key: 'toWarehouse',
      render: (text) => text || '-',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Ngày giao dịch',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      render: (date) =>
        new Date(date).toLocaleString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
    },
  ];

  const actions = (
    <Button
      icon={<ReloadOutlined />}
      className="h-8 px-4 bg-[#f0f2f5] text-[#111418] text-sm font-medium"
      onClick={() => fetchTransactions(currentPage, pageSize)}
    >
      Làm mới
    </Button>
  );

  const extraFilters = (
    <div className="flex gap-2">
      <Select
        placeholder="Kho hàng"
        value={selectedWarehouse}
        onChange={(value) => setSelectedWarehouse(value)}
        allowClear
        style={{ width: 160 }}
        size="small"
      >
        {warehouses.map((wh) => (
          <Option key={wh} value={wh}>{wh}</Option>
        ))}
      </Select>

      <Select
        placeholder="Loại vật liệu"
        value={selectedItemType}
        onChange={(value) => setSelectedItemType(value)}
        allowClear
        style={{ width: 160 }}
        size="small"
      >
        {itemTypes.map((type) => (
          <Option key={type} value={type}>{type}</Option>
        ))}
      </Select>

      <Button onClick={handleFilter} className="h-8 px-4 text-sm bg-blue-500 text-white">
        Lọc
      </Button>

      <Button onClick={clearFilters} className="h-8 px-4 text-sm bg-gray-200">
        Xóa lọc
      </Button>
    </div>
  );

  const onPageChange = (page) => {
    setCurrentPage(page);
    fetchTransactions(page, pageSize); // Gọi API với trang mới
  };

  return (
    <div className="p-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center px-4">
          <h2 className="text-xl font-semibold">Giao dịch kho</h2>
          <Button type="primary" onClick={showModal}>
            Giao dịch mới
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <InventoryTableLayout
          title="Giao dịch kho"
          columns={columns}
          dataSource={data}
          loading={loading}
          actions={actions}
          extraFilters={extraFilters}
          currentPage={currentPage}
          total={total}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        title="Giao dịch kho mới"
        width={800}
        destroyOnClose
      >
        <InventoryTransactionForm
          formData={formData}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onSuccess={handleCancel}
        />
      </Modal>
    </div>
  );
};

export default InventoryTransactionsPage;