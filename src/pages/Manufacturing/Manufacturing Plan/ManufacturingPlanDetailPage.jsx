import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Table, Button, Form, Input, DatePicker, Select, Modal, message, Space, Popconfirm
} from 'antd';
import moment from 'moment';
import {
  getOrderByOrderId,
  createOrderDetail,
  updateOrderDetail,
  approveOrder,
  deleteOrderDetail
} from '../../../api/manufacturing';
import { getProducts } from '../../../api/products';
import { Descriptions } from 'antd';
const { Option } = Select;

const ManufacturingPlanDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const [saving, setSaving] = useState(false);1
  // Lấy chi tiết kế hoạch và danh sách sản phẩm
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getOrderByOrderId(id);
      setOrder(res.data);
      const prodRes = await getProducts();
      setProducts(prodRes.data.products);
    } catch (err) {
      message.error('Lỗi khi tải dữ liệu');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [id]);

  // Xử lý thêm sản phẩm vào kế hoạch
    const handleAddProduct = async (values) => {
      const product = products.find(p => p.product_id === values.product_id);
      const newDetail = {
        item_id: values.product_id,
        item_type: "product",
        quantity: values.quantity,
        start_date: values.start_date.format('YYYY-MM-DD'),
        end_date: values.end_date.format('YYYY-MM-DD'),
        product_name: product?.name,
      };
      const newDetails = [...(order.details || []), newDetail];
      console.log("🚀 newDetails:", newDetails);
      await saveDetails(newDetails, 'Thêm sản phẩm thành công');
      addForm.resetFields();
    };
    
    // Xử lý lưu chi tiết kế hoạch
    const saveDetails = async (details, successMsg = 'Tạo mới thành công') => {
      setSaving(true);
      try {
        // Gửi từng item một
        for (const d of details) {
          console.log("📦 Full d:", d);
          await createOrderDetail({
            order_id: id,
            item_id: Number(d.item_id ?? d.product_id),
            item_type: "product",
            quantity: Number(d.quantity),
            specification: d.specification,
            planned_start: d.start_date?.toISOString?.() || d.start_date,
            planned_end: d.end_date?.toISOString?.() || d.end_date,
            priority: d.priority,
            notes: d.notes,
          });
        }
        
        message.success(successMsg);
        fetchData();
      } catch (err) {
        console.error("❌ Lỗi khi tạo chi tiết:", err);
        message.error('Lỗi khi tạo mới');
      }
      setSaving(false);
      setEditingKey('');
    };
    

    // Xử lý xóa sản phẩm khỏi kế hoạch
    const handleDelete = async (record) => {
      const newDetails = (order.details || []).filter(d => d !== record);
      await saveDetails(newDetails, 'Xóa thành công');
    };

  // Xử lý chỉnh sửa sản phẩm
  const edit = (record) => {
    form.setFieldsValue({
      ...record,
      start_date: moment(record.start_date),
      end_date: moment(record.end_date),
    });
    setEditingKey(record.product_id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (product_id) => {
    try {
      const row = await form.validateFields();
      const newDetails = (order.details || []).map(item => {
        if (item.product_id === product_id) {
          return {
            ...item,
            ...row,
            start_date: row.start_date.format('YYYY-MM-DD'),
            end_date: row.end_date.format('YYYY-MM-DD'),
          };
        }
        return item;
      });
      await saveDetails(newDetails, 'Cập nhật thành công');
    } catch (err) {
      message.error('Vui lòng nhập đủ thông tin hợp lệ');
    }
  };
  const generateOrderNumber = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomId = Math.floor(Math.random() * 9000) + 1000; // 4 chữ số ngẫu nhiên, từ 1000 đến 9999
    return `KET-${date}-${randomId}`;
  };
  

  // Phê duyệt kế hoạch
  const handleApprove = async () => {
    if (!order || !order.order_id) {
      message.error('Thiếu dữ liệu đơn hàng, không thể phê duyệt.');
      return;
    }
  
    try {
      setSaving(true);
      // Chỉ cần order_id, server sẽ xử lý chuyển trạng thái pending => approved
      await approveOrder(order.order_id);
  
      message.success('✅ Phê duyệt thành công!');
      setApproveModal(false);
      navigate('/manufacturing/orders');
    } catch (err) {
      console.error('❌ Approval Error:', err);
      message.error('Phê duyệt thất bại: ' + (err?.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };
  
  // Cột bảng sản phẩm
  const columns = [
    {
      title: 'Mã thành phẩm',
      dataIndex: 'item_id',
      key: 'item_id',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex:  'item_name',
      key: 'item_name',
      render: (name) => name || '—',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      editable: true,
    },

    {
      title: 'Ngày bắt đầu',
      dataIndex: 'planned_start',
      key: 'planned_start',
      render: (date) => moment(date).format('DD/MM/YYYY'),
      editable: true,
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'planned_end',
      key: 'planned_end',
      render: (date) => moment(date).format('DD/MM/YYYY'),
      editable: true,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => {
        const editable = editingKey === record.product_id;
        return editable ? (
          <span>
            <Button type="link" onClick={() => save(record.product_id)} loading={saving}>
              Lưu
            </Button>
            <Button type="link" onClick={cancel}>
              Hủy
            </Button>
          </span>
        ) : (
          <Space>
            <Button type="link" onClick={() => edit(record)}>
              Sửa
            </Button>
            <Popconfirm title="Xóa sản phẩm này?" onConfirm={() => handleDelete(record)}>
              <Button type="link" danger>Xóa</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // Tạo các cell có thể chỉnh sửa
  const mergedColumns = columns.map(col => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'quantity' ? 'number' : 'date',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: editingKey === record.product_id,
      }),
    };
  });

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    let inputNode;
    if (inputType === 'number') inputNode = <Input type="number" min={1} />;
    else if (inputType === 'date') inputNode = <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />;
    else inputNode = <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[{ required: true, message: `Vui lòng nhập ${title.toLowerCase()}` }]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  if (!order) return <Card loading />;

  return (
    <div style={{ padding: 24 }}>
      <Descriptions
        title={`Thông tin kế hoạch: ${order.order_number }`}
        bordered
        column={2}
        style={{ marginBottom: 24 }}
      >
        <Descriptions.Item label="Plan ID">{order.order_id}</Descriptions.Item>
        <Descriptions.Item label="Người tạo">{order.User?.username || 'Không xác định'}</Descriptions.Item>
        <Descriptions.Item label="Mô tả">{order.description}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">{order.status}</Descriptions.Item>
        <Descriptions.Item label="Thời gian bắt đầu">
          {moment(order.start_date).format('DD/MM/YYYY')}
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian kết thúc">
          {moment(order.end_date).format('DD/MM/YYYY')}
        </Descriptions.Item>
      </Descriptions>


      <Card title="Danh sách sản phẩm cần sản xuất" bordered={false}>
        <Form form={form} component={false}>
          <Table
            components={{ body: { cell: EditableCell } }}
            bordered
            dataSource={order.ManufacturingOrderDetails || []}
            columns={mergedColumns}
            rowKey={r => r.detail_id + r.planned_start}
            pagination={false}
          />
        </Form>
        <div style={{ marginTop: 24, borderTop: '1px solid #eee', paddingTop: 16 }}>
          <Form
            form={addForm}
            layout="inline"
            onFinish={handleAddProduct}
            style={{ gap: 8, flexWrap: 'wrap', display: 'flex' }}
          >
            <Form.Item
              name="product_id"
              rules={[{ required: true, message: 'Chọn sản phẩm' }]}
              style={{ minWidth: 200, flex: 1 }}
            >
              <Select placeholder="Chọn sản phẩm" style={{ width: '100%' }} allowClear
                onChange={() => addForm.setFieldsValue({ bom_version: undefined })}
              >
                {Array.isArray(products) && products.map(p => (
                  <Option key={p.product_id} value={p.product_id}>{p.name}</Option>
                ))}
              </Select>

            </Form.Item>
            <Form.Item
              shouldUpdate={(prev, curr) => prev.product_id !== curr.product_id}
              noStyle
            >
              {({ getFieldValue }) => {
                if (!Array.isArray(products)) return null;
                const product = products.find(p => p.product_id === getFieldValue('product_id'));
                if (!product?.BOMs || product.BOMs.length === 0) return null;
                return (
                  <Form.Item
                    name="bom_version"
                    rules={[{ required: false }]}
                    style={{ minWidth: 150, flex: 1 }}
                  >
                    <Select placeholder="Chọn BOM version" style={{ width: '100%' }} allowClear>
                      {product.BOMs.map(bom => (
                        <Option key={bom.version} value={bom.version}>{bom.version}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                );
              }}

            </Form.Item>
            <Form.Item
              name="quantity"
              rules={[{ required: true, message: 'Nhập số lượng' }]}
              style={{ minWidth: 120, flex: 1 }}
            >
              <Input type="number" min={1} placeholder="Số lượng" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="start_date"
              rules={[{ required: true, message: 'Chọn ngày bắt đầu' }]}
              style={{ minWidth: 160, flex: 1 }}
            >
              <DatePicker placeholder="Ngày bắt đầu" format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="end_date"
              rules={[{ required: true, message: 'Chọn ngày kết thúc' }]}
              style={{ minWidth: 160, flex: 1 }}
            >
              <DatePicker placeholder="Ngày kết thúc" format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={saving}>
                Thêm sản phẩm
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
      {order.status === 'pending' && (
        <div style={{ marginTop: 32, textAlign: 'right' }}>
          <Button type="primary" onClick={() => setApproveModal(true)}>
            Phê duyệt & tạo lệnh sản xuất
          </Button>
        </div>
      )}
      <Modal
        open={approveModal}
        title="Xác nhận phê duyệt kế hoạch"
        onOk={handleApprove}
        onCancel={() => setApproveModal(false)}
        confirmLoading={saving}
        okText="Phê duyệt"
        cancelText="Hủy"
      >
        Bạn chắc chắn muốn phê duyệt và tạo lệnh sản xuất từ kế hoạch này?
      </Modal>
    </div>
  );
};

export default ManufacturingPlanDetailPage; 