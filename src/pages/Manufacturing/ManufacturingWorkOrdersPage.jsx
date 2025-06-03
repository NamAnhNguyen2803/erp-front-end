import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Badge, message, Spin } from 'antd';
import { getWorkOrders } from '../../api/manufacturing';
import ManufacturingLayout from '../../layouts/ManufacturingLayout';
import moment from 'moment';

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
const priorityColors = {
  high: 'red',
  medium: 'orange',
  low: 'green',
};
const priorityLabels = {
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
};

export default function ManufacturingWorkOrdersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
    // eslint-disable-next-line
  }, [pagination.current, pagination.pageSize]);

  const fetchData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res = await getWorkOrders();
      // Giả sử API trả về { work_orders: [], pagination: { current, pageSize, total }      
      const workOrders = res.data.data.workOrders || [];
      setData(workOrders);
      const paginationData = res.data.data.pagination || {};
      setPagination({
        current: paginationData.current,
        pageSize: paginationData.pageSize,
        total: paginationData.total,
      });
      console.log("🚀 res:", res.data.data.data);
    } catch (err) {
      setError('Không thể tải dữ liệu');
    }
    setLoading(false);
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: 'work_id',
      key: 'work_id',
      render: (text) => <b>{text}</b>,
    },
    {
      title: 'Mã Work Order',
      dataIndex: 'work_code',
      key: 'work_code',
      render: (text) => <b>{text}</b>,
    },
    {
      title: 'Bước quy trình',
      dataIndex: 'process_step',
      key: 'process_step',
      render: (step) => <Badge color="blue" text={step} />,
    },
    {
      title: 'Bộ phận',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Người phụ trách',
      dataIndex: ['AssignedUser', 'username'],
      key: 'assigned_user',
      render: (_, record) => record.AssignedUser?.username || '',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text) => <Tag color={statusColors[text] || 'default'}>{statusLabels[text] || text}</Tag>,
    },
    {
      title: 'Ngày bắt đầu dự kiến',
      dataIndex: 'planned_start',
      key: 'planned_start',
      render: (date) => date ? moment(date).format('DD/MM/YYYY HH:mm') : '',
    },
    {
      title: 'Ngày kết thúc dự kiến',
      dataIndex: 'planned_end',
      key: 'planned_end',
      render: (date) => date ? moment(date).format('DD/MM/YYYY HH:mm') : '',
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (text) => <Tag color={priorityColors[text] || 'default'}>{priorityLabels[text] || text}</Tag>,
    },
  ];


  const filteredData = data.filter(item =>
    (item.work_code?.toLowerCase().includes(search.toLowerCase()) ||
     item.process_step?.toLowerCase().includes(search.toLowerCase()) ||
     item.department?.toLowerCase().includes(search.toLowerCase())) &&
    (status === '' || item.status === status) &&
    (priority === '' || item.priority === priority)
  );
  
  
  return (
    <Spin spinning={loading} tip="Đang tải dữ liệu...">
      <ManufacturingLayout
        title="Work Orders"
        breadcrumb={['Trang chủ', 'Sản xuất', 'Work Orders']}
        searchPlaceholder="Tìm kiếm mã WO, bước, bộ phận..."
        columns={columns}
        data={filteredData}
        loading={loading}
        pagination={pagination}
        filters={[
          {
            defaultValue: '',
            options: [
              { value: '', label: 'Tất cả trạng thái' },
              ...Object.entries(statusLabels).map(([value, label]) => ({ value, label })),
            ],
            onChange: setStatus,
          },
          {
            defaultValue: '',
            options: [
              { value: '', label: 'Tất cả ưu tiên' },
              ...Object.entries(priorityLabels).map(([value, label]) => ({ value, label })),
            ],
            onChange: setPriority,
          },
        ]}
        onRow={(record) => ({
          onClick: () => navigate(`/manufacturing-work-orders/${record.work_id}`),
          style: { cursor: 'pointer' },
        })}
        showAddButton={false}
      />
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
    </Spin>
  );
}