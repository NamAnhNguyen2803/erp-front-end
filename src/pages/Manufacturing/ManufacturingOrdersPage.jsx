import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductTableLayout from '../../components/ProductTableLayout';
import { Tag, Progress, Button, message, Spin } from 'antd';
import { getAllOrders } from '../../api/manufacturing';
import ManufacturingLayout from '../../layouts/ManufacturingLayout';
const statusColors = {
  pending: 'blue',
  active: 'cyan',
  finished: 'green',
  cancelled: 'red',
};

const statusLabels = {
  pending: 'Chờ thực hiện',
  active: 'Đang thực hiện',
  finished: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

const statusOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'pending', label: 'Chờ thực hiện' },
  { value: 'active', label: 'Đang thực hiện' },
  { value: 'finished', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
];

const ManufacturingOrdersPage = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getAllOrders()
      .then((res) => {
        setData(res.data.orders || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải dữ liệu');
        setLoading(false);
      });
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'order_id', key: 'order_id' },
    { title: 'Mã lệnh', dataIndex: 'order_number', key: 'order_number' },
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
        <Tag color={statusColors[text] || 'default'}>
          {statusLabels[text] || text}
        </Tag>
      ),
    },
    {
      title: 'Tiến độ',
      dataIndex: 'progress',
      key: 'progress',
      render: (_, record) => <Progress percent={0} size="small" />,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/manufacturing-orders/${record.order_id}`)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const filteredData = data.filter(
    (item) =>
      (item.order_number?.toLowerCase().includes(search.toLowerCase()) ||
        item.Product?.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.ManufacturingPlan?.plan_code
          ?.toLowerCase()
          .includes(search.toLowerCase())) &&
      (status === '' || item.status === status)
  );

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
            options: statusOptions,
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
