import React, { useEffect, useState } from 'react';
import { Button, Select, Modal, Tag, Space } from 'antd';
import { ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import InventoryTableLayout from '../../layouts/InventoryLayout';
import { transactionTypeMap, itemTypeMap } from '../../constants/transactionType.enum';
import InventoryTransactionForm from './InventoryTransactionForm';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getAllInventoryTransactions } from '@/api/inventory';
const { RangePicker } = DatePicker;

const { Option } = Select;

const InventoryTransactionsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);
  const exportToExcel = async () => {
    try {
      const res = await getAllInventoryTransactions()
      console.log('Exporting transactions:', res.data.transactions);
      const exportData = res.data.transactions.map((item) => ({
        Mã: item.item_id || '',
        Tên: item.item_name || '',
        Đơn_vị: item.item_details?.unit || '',
        Số_lượng: item.quantity,
        Từ_kho: item.FromWarehouse?.name || '',
        Đến_kho: item.ToWarehouse?.name || '',
        Loại_giao_dịch: transactionTypeMap[item.transaction_type] || item.transaction_type,
        Loại_vật_tư: itemTypeMap[item.item_type] || item.item_type,
        Ngày_giao_dịch: new Date(item.createAt).toLocaleString('vi-VN'),
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, `transactions_${Date.now()}.xlsx`);
    } catch (err) {
      console.error('Export failed', err);
    }
  };


  const handleSubmit = (data) => {
    console.log('Submit:', data);
    setIsModalOpen(false);
    fetchTransactions();
  };

  const fetchTransactions = async (page = 1, limit = pageSize) => {
    setLoading(true);
    try {
      const res = await getAllInventoryTransactions()

      const raw = res.data.transactions.map((item) => ({
        key: item.transaction_id,
        code: item.item_id || '',
        name: item.item_name || '',
        unit: item.item_details?.unit || '',
        quantity: item.quantity,
        transactionDate: item.createdAt,
        itemType: item.item_type,
        transactionType: item.transaction_type,
        fromWarehouse: item.FromWarehouse?.name || '-',
        toWarehouse: item.ToWarehouse?.name || '-',
      }));

      setData(raw);
      setTotal(res.data.total);
      extractFilters(raw);
      console.log('Fetched transactions:', raw);
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    }
    setLoading(false);
  };

  const extractFilters = (data) => {
    const warehouseSet = new Set();
    const typeSet = new Set();
    data.forEach((item) => {
      if (item.fromWarehouse) warehouseSet.add(item.fromWarehouse);
      if (item.toWarehouse) warehouseSet.add(item.toWarehouse);
      if (item.itemType) typeSet.add(item.itemType);
    });
    setWarehouses([...warehouseSet]);
    setItemTypes([...typeSet]);
  };

  const handleFilter = () => {
    fetchTransactions(1, pageSize);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedWarehouse(null);
    setSelectedItemType(null);
    fetchTransactions(1, pageSize);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
    fetchTransactions(1, value);
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
      render: (value) => <Tag color="blue">{itemTypeMap[value] || value}</Tag>,
    },
    {
      title: 'Loại giao dịch',
      dataIndex: 'transactionType',
      key: 'transactionType',
      render: (value) => (
        <Tag color={value === 'import' ? 'green' : value === 'export' ? 'red' : 'gold'}>
          {transactionTypeMap[value] || value}
        </Tag>
      ),
    },
    {
      title: 'Kho đi → đến',
      key: 'warehouseRoute',
      render: (_, record) => `${record.fromWarehouse} → ${record.toWarehouse}`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
    },
    {
      title: 'Ngày giao dịch',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      render: (date) =>
        date ? new Date(date).toLocaleString('vi-VN', { hour12: false }) : '-',
    }

  ];

  const actions = (
    <Space className='mb-4'>
      <Button icon={<ReloadOutlined />} onClick={() => fetchTransactions(currentPage, pageSize)}>
        Làm mới
      </Button>
      <Button
        onClick={exportToExcel}
        type='primary'
        className="h-8 px-4 text-sm bg-green-600 text-white"
      >
        Xuất Excel
      </Button>
    </Space>


  );

  const extraFilters = (
    <Space wrap>
      <Select
        placeholder="Kho hàng"
        value={selectedWarehouse}
        onChange={(value) => setSelectedWarehouse(value)}
        allowClear
        style={{ minWidth: 160 }}
        size="middle"
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
        style={{ minWidth: 160 }}
        size="middle"
      >
        {itemTypes.map((type) => (
          <Option key={type} value={type}>{type}</Option>
        ))}
      </Select>

      <Button onClick={handleFilter} className="bg-blue-600 text-white">
        Lọc
      </Button>

      <Button onClick={clearFilters}>
        Xóa lọc
      </Button>
      <RangePicker
        size="middle"
        value={dateRange}
        onChange={(dates) => setDateRange(dates)}
        format="DD/MM/YYYY"
      />
    </Space>
  );

  const onPageChange = (page) => {
    setCurrentPage(page);
    fetchTransactions(page, pageSize);
  };

  return (

    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between px-4 py-2 bg-white rounded shadow border border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">
          Giao dịch kho
        </h1>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showModal}
          className="flex items-center h-10 px-4 font-medium"
        >
          Giao dịch mới
        </Button>
      </div>




      <div className="flex flex-col gap-4">
        {extraFilters}
        {actions}
        <InventoryTableLayout
          title="Danh sách giao dịch"
          columns={columns}
          dataSource={data}
          loading={loading}
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
        title={<span className="text-lg font-medium">Tạo giao dịch mới</span>}
        width={800}
        destroyOnClose
        centered
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