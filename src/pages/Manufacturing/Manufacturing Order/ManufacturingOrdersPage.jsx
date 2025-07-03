import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductTableLayout from '@/components/ProductTableLayout';
import { Tag, Progress, Button, message, Spin } from 'antd';
import { getAllOrders, completeManufacturingOrder, deleteOrder } from '@/api/manufacturing';
import ManufacturingLayout from '@/layouts/ManufacturingLayout';
import { MANUFACTURING_ORDER_STATUS_COLORS, MANUFACTURING_ORDER_STATUS_LABELS, MANUFACTURING_ORDER_STATUS_OPTIONS, MANUFACTURING_ORDER_STATUS } from '@/constants/manufacturingStatus.enum';

const ManufacturingOrdersPage = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = () => {
    setLoading(true);
    getAllOrders()
      .then((res) => {
        setData(res.data.orders || []);
        setLoading(false);
        console.log('Fetched orders:', res.data.orders);
      })
      .catch(() => {
        setError('Không thể tải dữ liệu');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCompleteOrder = async (orderId) => {
    try {
      await completeManufacturingOrder(orderId, {});
      message.success('Lệnh sản xuất đã hoàn thành!');
      fetchOrders(); // Refresh data
    } catch (error) {
      message.error('Không thể hoàn thành lệnh sản xuất.');
      console.error('Error completing order:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      message.success('Lệnh sản xuất đã bị xóa!');
      fetchOrders(); // Refresh data
    } catch (error) {
      message.error('Không thể xóa lệnh sản xuất.');
      console.error('Error deleting order:', error);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'order_id', key: 'order_id' },
    { title: 'Mã lệnh', dataIndex: 'order_code', key: 'order_code' },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (val) => (val ? new Date(val).toLocaleDateString() : ''),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <Tag color={MANUFACTURING_ORDER_STATUS_COLORS[text] || 'default'}>
          {MANUFACTURING_ORDER_STATUS_LABELS[text] || text}
        </Tag>
      ),
    },
    {
      title: 'Tiến độ',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => <Progress percent={progress} size="small" />,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => navigate(`/manufacturing-orders/${record.order_id}`)}
          >
            Xem chi tiết
          </Button>
          {record.status !== MANUFACTURING_ORDER_STATUS.COMPLETED && record.status !== MANUFACTURING_ORDER_STATUS.CANCELLED && (
            <Button
              type="link"
              onClick={() => handleCompleteOrder(record.order_id)}
            >
              Hoàn thành
            </Button>
          )}
          {record.status !== 'cancelled' && (
            <Button
              type="link"
              danger
              onClick={() => handleDeleteOrder(record.order_id)}
            >
              Xóa
            </Button>
          )}
        </>
      ),
    },
  ];

  const filteredData = data.filter(
    (item) =>
      (item.order_code?.toLowerCase().includes(search.toLowerCase()) ||
        item.Product?.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.ManufacturingPlan?.plan_code
          ?.toLowerCase()
          .includes(search.toLowerCase())) &&
      (status === '' || item.status === status)
  );
console.log('Filtered Data:', filteredData);
  return (
    <Spin spinning={loading} tip="Đang tải dữ liệu...">
      <ManufacturingLayout
        title="Lệnh sản xuất"
        breadcrumb={['Trang chủ', 'Sản xuất', 'Lệnh sản xuất']}
        searchPlaceholder="Tìm kiếm mã lệnh, sản phẩm, kế hoạch..."
        onAddClick={() => message.info('Chức năng thêm chưa khả dụng')}
        columns={columns}
        data={filteredData}
        filters={[
          {
            defaultValue: '',
            options: MANUFACTURING_ORDER_STATUS_OPTIONS,
            onChange: setStatus,
          },
        ]}
        showAddButton={true}
        pagination={{ pageSize: 10 }}
      />
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
    </Spin>
  );
};

export default ManufacturingOrdersPage;
