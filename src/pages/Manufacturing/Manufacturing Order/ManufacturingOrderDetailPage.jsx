import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Tag, Progress, Tabs, Table, Spin, Modal, Button, Input, Pagination } from 'antd';
import { useParams } from 'react-router-dom';
import { getOrderByOrderId, getWorkOrderDetail } from '@/api/manufacturing';
import { Breadcrumb } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import WorkOrderList from '@/components/WorkOrderList';
const statusColors = {
  pending: 'blue',
  active: 'cyan',
  finished: 'green',
  cancelled: 'red',
  'Đang làm': 'blue',
  'Chưa làm': 'default',
};
const statusLabels = {
  pending: 'Chờ thực hiện',
  active: 'Đang thực hiện',
  finished: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

const stepColumns = [
  { title: 'Bước', dataIndex: 'name', key: 'name' },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (text) => <Tag color={statusColors[text] || 'default'}>{statusLabels[text] || text}</Tag> },
  { title: 'Bắt đầu', dataIndex: 'start', key: 'start' },
  { title: 'Kết thúc', dataIndex: 'end', key: 'end' },
  { title: 'Người thực hiện', dataIndex: 'operator', key: 'operator' },
];

const workOrderColumns = [
  { title: 'Mã WO', dataIndex: 'code', key: 'code' },
  { title: 'Tên', dataIndex: 'name', key: 'name' },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (text) => <Tag color={statusColors[text] || 'default'}>{statusLabels[text] || text}</Tag> },
  { title: 'Người thực hiện', dataIndex: 'operator', key: 'operator' },
];

const priorityOrder = { high: 1, medium: 2, low: 3 };

const productColumns = [
  { title: 'Mã thành phẩm', dataIndex: 'detail_id', key: 'detail_id' },
  { title: 'Tên thành phẩm', dataIndex: 'item_name', key: 'item_name' },
  { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
  {
    title: 'Ưu tiên', dataIndex: 'priority', key: 'priority',
    render: (text) => {
      let color = 'default';
      if (text === 'high') color = 'red';
      else if (text === 'medium') color = 'orange';
      else if (text === 'low') color = 'blue';
      return <Tag color={color}>{text}</Tag>;
    }
  },
  { title: 'Đã sản xuất', dataIndex: 'produced_qty', key: 'produced_qty' },
  { title: 'Bắt đầu', dataIndex: 'planned_start', key: 'planned_start', render: (text) => text ? new Date(text).toLocaleString() : '' },
  { title: 'Kết thúc', dataIndex: 'planned_end', key: 'planned_end', render: (text) => text ? new Date(text).toLocaleString() : '' },
  { title: 'Ghi chú', dataIndex: 'notes', key: 'notes' },
];

const ManufacturingOrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Work Orders state
  const [workOrders, setWorkOrders] = useState([]);
  const [woLoading, setWoLoading] = useState(false);
  const [woError, setWoError] = useState(null);
  const [woPage, setWoPage] = useState(1);
  const [woPageSize, setWoPageSize] = useState(10);
  const [woTotal, setWoTotal] = useState(0);
  const [woSearch, setWoSearch] = useState('');
  const [woStatus, setWoStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getOrderByOrderId(id)
      .then(res => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải dữ liệu');
        setLoading(false);
      });
  }, [id]);

  // Fetch work orders
  useEffect(() => {
    setWoLoading(true);
    setWoError(null);
    getWorkOrderDetail(id)
      .then(res => {
        let data = res.data || [];

        // Filter by search and status
        if (woSearch) {
          data = data.filter(
            wo => (wo.order_number && wo.order_number.toLowerCase().includes(woSearch.toLowerCase()))
              || (wo.status && wo.status.toLowerCase().includes(woSearch.toLowerCase()))
          );
        }
        if (woStatus) {
          data = data.filter(wo => wo.status === woStatus);
        }
        setWoTotal(data.length);
        // Pagination
        const start = (woPage - 1) * woPageSize;
        setWorkOrders(data.slice(start, start + woPageSize));
        setWoLoading(false);
      })
      .catch(() => {
        setWoLoading(false);
      });
  }, [woPage, woPageSize, woSearch, woStatus]);

  // Work Order columns
  const workOrderColumnsFull = [
    { title: 'Mã WO', dataIndex: 'order_number', key: 'order_number' },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (text) => <Tag color={statusColors[text] || 'default'}>{statusLabels[text] || text}</Tag> },
    { title: 'Người thực hiện', dataIndex: 'operator', key: 'operator' },
    { title: 'Ngày bắt đầu', dataIndex: 'start_date', key: 'start_date', render: (text) => text ? new Date(text).toLocaleDateString() : '' },
    { title: 'Ngày kết thúc', dataIndex: 'end_date', key: 'end_date', render: (text) => text ? new Date(text).toLocaleDateString() : '' },
  ];

  // Sort products by priority and planned_start
  const sortedProducts = (order?.ManufacturingOrderDetails || []).slice().sort((a, b) => {
    const p1 = priorityOrder[a.priority] || 99;
    const p2 = priorityOrder[b.priority] || 99;
    if (p1 !== p2) return p1 - p2;
    return new Date(a.planned_start) - new Date(b.planned_start);
  });
  const calculateProgress = () => {
    const products = order?.ManufacturingOrderDetails || [];
    if (!products.length) return 0;

    const totalRequired = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
    const totalProduced = products.reduce((sum, p) => sum + (p.produced_qty || 0), 0);

    if (totalRequired === 0) return 0;

    return Math.round((totalProduced / totalRequired) * 100);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item>Sản xuất</Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/manufacturing-orders">Lệnh sản xuất</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{order?.order_number || id}</Breadcrumb.Item>
      </Breadcrumb>

      <h1>Chi tiết lệnh sản xuất</h1>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        {order && (
          <Card style={{ marginBottom: 24 }}>
            <Descriptions column={2}>
              <Descriptions.Item label="Mã lệnh">{order.order_number}</Descriptions.Item>
              <Descriptions.Item label="Kế hoạch">{order.ManufacturingPlan?.plan_code}</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">{order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}</Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">{order.start_date ? new Date(order.start_date).toLocaleDateString() : ''}</Descriptions.Item>
              <Descriptions.Item label="Ngày kết thúc">{order.end_date ? new Date(order.end_date).toLocaleDateString() : ''}</Descriptions.Item>
              <Descriptions.Item label="Người tạo">{order.User?.username}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={statusColors[order.status] || 'default'}>{statusLabels[order.status] || order.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tiến độ">
                <Progress percent={calculateProgress()} size="small" />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
        <Tabs
          defaultActiveKey="products"
          items={[
            {
              key: 'products',
              label: 'Thành phẩm cần sản xuất',
              children: (
                <Table
                  columns={productColumns}
                  dataSource={sortedProducts}
                  rowKey="detail_id"
                  pagination={false}
                  onRow={record => ({
                    onClick: () => {
                      setSelectedProduct(record);
                      setModalVisible(true);
                    },
                    style: { cursor: 'pointer' },
                  })}
                  locale={{ emptyText: 'Không có thành phẩm' }}
                />
              ),
            },
            {
              key: 'workorders',
              label: 'Work Orders',
              children: (
                <div>
                  <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
                    <Input.Search
                      placeholder="Tìm kiếm theo mã WO hoặc trạng thái"
                      allowClear
                      onSearch={v => setWoSearch(v)}
                      style={{ width: 250 }}
                    />
                    <Input
                      placeholder="Lọc theo trạng thái"
                      allowClear
                      onChange={e => setWoStatus(e.target.value)}
                      style={{ width: 180 }}
                    />
                  </div>
                  {woError && <div style={{ color: 'red', marginBottom: 8 }}>{woError}</div>}
                  <Spin spinning={woLoading} tip="Đang tải Work Orders...">
                    {order && order.ManufacturingOrderDetails && (
                      <WorkOrderList
                        orderId={id}
                        orderDetails={order.ManufacturingOrderDetails}
                      />
                    )}
                  </Spin>
                </div>
              ),
            },
          ]}
        />
        {/* Modal for product detail */}
        <Modal
          open={modalVisible}
          title="Chi tiết thành phẩm"
          onCancel={() => setModalVisible(false)}
          footer={<Button onClick={() => setModalVisible(false)}>Đóng</Button>}
        >
          {selectedProduct && (
            <Descriptions column={1} bordered size="small">
              {Object.entries(selectedProduct).map(([key, value]) => (
                <Descriptions.Item label={key} key={key}>{String(value)}</Descriptions.Item>
              ))}
            </Descriptions>
          )}
        </Modal>
      </Spin>
    </div>
  );
};

export default ManufacturingOrderDetailPage; 