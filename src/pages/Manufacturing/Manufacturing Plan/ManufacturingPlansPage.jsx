import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Tag } from 'antd';
import { MANUFACTURING_ORDER_STATUS_LABELS, MANUFACTURING_ORDER_STATUS_COLORS } from '@/constants/manufacturingStatus.enum';
import moment from 'moment';
import { getAllOrders, createOrder } from '../../../api/manufacturing';
import ManufacturingLayout from '../../../layouts/ManufacturingLayout';
import { Form, Input, Modal } from 'antd';
import { DatePicker } from 'antd';


const ManufacturingPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
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
      title: 'Id',
      dataIndex: 'order_id',
      key: 'order_id',
    },
     {
      title: 'Mã kế hoạch',
      dataIndex: 'order_code',
      key: 'order_code',
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
      render: (text) => (
        <Tag color={MANUFACTURING_ORDER_STATUS_COLORS[text] || 'default'}>
          {MANUFACTURING_ORDER_STATUS_LABELS[text] || text}
        </Tag>
      ),
    },
  ];

  const handleCreatePlan = async (values) => {
    const [start, end] = values.date_range;
    const payload = {
      order_code: values.order_code,
      description: values.description || '',
      start_date: start.toISOString(),
      end_date: end.toISOString(),
      status: 'pending', // or any default status you want
      created_by: 1, // hardcoded user - sau dùng từ context
    };
    console.log('Payload:', payload);
    await createOrder(payload);
    try {
      await createOrder(payload);
      message.success('Tạo kế hoạch thành công');
      setIsModalOpen(false);
      form.resetFields();
      fetchPlans();
    } catch (err) {
      console.error(err);
      message.error('Tạo kế hoạch thất bại');
    }
  };

  return (
    <>
      <ManufacturingLayout
        title="Kế hoạch sản xuất"
        breadcrumb={['Sản xuất', 'Kế hoạch sản xuất']}
        columns={columns}
        data={plans}
        loading={loading}
        pagination={pagination}
        showAddButton={true}
        onAddClick={() => setIsModalOpen(true)}
        onRow={(record) => ({
          onClick: () => navigate(`/manufacturing/plans/${record.order_id || record.id}`),
          style: { cursor: 'pointer' },
        })}
      />

      <Modal
        title="Tạo kế hoạch sản xuất"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleCreatePlan}>
          <Form.Item
            label="Mã kế hoạch"
            name="order_code"
            rules={[{ required: true, message: 'Vui lòng nhập mã kế hoạch' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input />
          </Form.Item>
          <Form.Item
            label="Khoảng thời gian"
            name="date_range"
            rules={[{ required: true, message: 'Chọn thời gian bắt đầu và kết thúc' }]}
          >
            <DatePicker.RangePicker format="DD/MM/YYYY" />
          </Form.Item>

        </Form>
      </Modal>
    </>
  );
};

export default ManufacturingPlansPage;