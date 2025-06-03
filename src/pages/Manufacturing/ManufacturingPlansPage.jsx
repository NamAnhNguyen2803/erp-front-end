import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import moment from 'moment';
import { getAllOrders } from '../../api/manufacturing';
import ManufacturingLayout from '../../layouts/ManufacturingLayout';

const ManufacturingPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const navigate = useNavigate();

  const fetchPlans = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await getAllOrders();
      setPlans(response.data.orders || response.data || []);
      setPagination({
        current: page,
        pageSize,
        total: response.data.total || response.data.length || 0,
      });
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi tải dữ liệu kế hoạch sản xuất');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans(pagination.current, pagination.pageSize);
    // eslint-disable-next-line
  }, []);

  const columns = [
    {
      title: 'Mã kế hoạch',
      dataIndex: 'order_id',
      key: 'order_id',
    },
    {
      title: 'Mô tả',
      dataIndex: 'order_number',
      key: 'order_number',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <ManufacturingLayout
      title="Kế hoạch sản xuất"
      breadcrumb={['Sản xuất', 'Kế hoạch sản xuất']}
      columns={columns}
      data={plans}
      loading={loading}
      pagination={pagination}
      showAddButton={true}
      onAddClick={() => message.info('Chức năng thêm kế hoạch chưa được triển khai')}
      onRow={(record) => ({
        onClick: () => navigate(`/manufacturing/plans/${record.order_id || record.id}`),
        style: { cursor: 'pointer' },
      })}
    />
  );
};

export default ManufacturingPlansPage;
