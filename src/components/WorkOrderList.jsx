import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, InputNumber, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getWorkOrdersByOrderId, createWorkOrder } from '../api/manufacturing'; // Đường dẫn tùy theo cấu trúc project
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { TextArea } = Input;

const WorkOrderList = ({ orderId, orderDetails }) => {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Load work orders khi component mount
  useEffect(() => {
    if (orderId) {
      loadWorkOrders();
    }
  }, [orderId]);
  const loadWorkOrders = async () => {
    try {
      setLoading(true);
      const response = await getWorkOrdersByOrderId(orderId);
      setWorkOrders(response.data.data);
      console.log("🚀 response.data:", response.data);
    } catch (error) {
      message.error('Không thể tải danh sách Work Orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkOrder = async (values) => {
    try {
      // Chuyển đổi moment objects thành ISO strings
      const data = {
        ...values,
        order_id: parseInt(orderId),
        planned_start: values.planned_start ? values.planned_start.toISOString() : null,
        planned_end: values.planned_end ? values.planned_end.toISOString() : null,
      };

      await createWorkOrder(data);
      message.success('Tạo Work Order thành công');
      setModalVisible(false);
      form.resetFields();
      loadWorkOrders(); // Reload danh sách
    } catch (error) {
      message.error('Không thể tạo Work Order');
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'Mã ca sản xuất',
      dataIndex: 'work_id',
      key: 'work_id',
      width: 120,
    },
    {
      title: 'Tên ca sản xuất',
      dataIndex: 'work_code',
      key: 'work_code',
      width: 150,
    },
   
    {
      title: 'Công đoạn',
      dataIndex: 'process_step',
      key: 'process_step',
      width: 120,
    },
    {
      title: 'Loại thao tác',
      dataIndex: 'operation_type',
      key: 'operation_type',
      width: 120,
    },
    {
      title: 'Số lượng',
      dataIndex: 'work_quantity',
      key: 'work_quantity',
      width: 100,
      render: (value) => value?.toLocaleString(),
    },
    {
      title: 'Đã hoàn thành',
      dataIndex: 'completed_qty',
      key: 'completed_qty',
      width: 120,
      render: (value) => value?.toLocaleString() || 0,
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
      width: 120,
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority) => {
        const colors = {
          urgent: 'red',
          high: 'orange',
          normal: 'blue',
          low: 'gray'
        };
        return <span style={{ color: colors[priority] }}>{priority}</span>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const colors = {
          pending: 'orange',
          in_progress: 'blue',
          completed: 'green',
          paused: 'gray',
          cancelled: 'red'
        };
        return <span style={{ color: colors[status] }}>{status}</span>;
      },
    },
    {
      title: 'Thời gian dự kiến',
      key: 'planned_time',
      width: 200,
      render: (record) => (
        <div>
          <div>Bắt đầu: {record.planned_start ? moment(record.planned_start).format('DD/MM/YYYY HH:mm') : '-'}</div>
          <div>Kết thúc: {record.planned_end ? moment(record.planned_end).format('DD/MM/YYYY HH:mm') : '-'}</div>
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (record) => (
        <div>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
        </div>
      ),
    },
  ];

  const handleEdit = (record) => {
    // TODO: Implement edit functionality
    message.info('Chức năng sửa đang được phát triển');
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Danh sách Work Orders</h3>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Thêm Work Order
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(workOrders) ? workOrders : [workOrders]} 
        rowKey="work_id"
        loading={loading}
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} work orders`,
        }}
        onRow={(record) => ({
          onClick: () => navigate(`/manufacturing-work-orders/${record.work_id}`),
          style: { cursor: 'pointer' }, // Cho hiệu ứng trực quan hơn
        })}
      />

      <Modal
        title="Thêm Work Order mới"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateWorkOrder}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="detail_id"
              label="Chi tiết đơn hàng"
              rules={[{ required: true, message: 'Vui lòng chọn chi tiết đơn hàng' }]}
            >
              <Select placeholder="Chọn chi tiết đơn hàng">
                {orderDetails?.map(detail => (
                  <Option key={detail.detail_id} value={detail.detail_id}>
                    {detail.item_type === 'product' ? 'Sản phẩm' : 'Bán thành phẩm'} - 
                    Số lượng: {detail.quantity}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="process_step"
              label="Công đoạn"
            >
              <Input placeholder="VD: Cutting, Welding, Assembly..." />
            </Form.Item>

            <Form.Item
              name="operation_type"
              label="Loại thao tác"
              rules={[{ required: true, message: 'Vui lòng chọn loại thao tác' }]}
            >
              <Select>
                <Option value="produce">Sản xuất</Option>
                <Option value="assemble">Lắp ráp</Option>
                <Option value="process">Gia công</Option>
                <Option value="inspect">Kiểm tra</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="work_quantity"
              label="Số lượng công việc"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="department"
              label="Phòng ban"
            >
              <Input placeholder="VD: Manufacturing, Assembly..." />
            </Form.Item>

            <Form.Item
              name="priority"
              label="Độ ưu tiên"
            >
              <Select defaultValue="normal">
                <Option value="urgent">Khẩn cấp</Option>
                <Option value="high">Cao</Option>
                <Option value="normal">Bình thường</Option>
                <Option value="low">Thấp</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="planned_start"
              label="Thời gian bắt đầu dự kiến"
            >
              <DatePicker 
                showTime 
                style={{ width: '100%' }}
                format="DD/MM/YYYY HH:mm"
              />
            </Form.Item>

            <Form.Item
              name="planned_end"
              label="Thời gian kết thúc dự kiến"
            >
              <DatePicker 
                showTime 
                style={{ width: '100%' }}
                format="DD/MM/YYYY HH:mm"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="Mô tả công việc"
          >
            <TextArea rows={3} placeholder="Mô tả chi tiết công việc..." />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <TextArea rows={2} placeholder="Ghi chú thêm..." />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Button 
              onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}
              style={{ marginRight: 8 }}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Tạo Work Order
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkOrderList;