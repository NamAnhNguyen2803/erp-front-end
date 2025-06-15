import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Form, Input, Select, Spin, Button, Tag, message, Popconfirm, Space } from 'antd';
import ProductTableLayout from '@/components/ProductTableLayout';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

const { Option } = Select;
const { confirm } = Modal;

const tabs = [
  { label: 'Vật tư', key: 'materials', endpoint: '/api/v1/materials' },
  { label: 'Bán thành phẩm', key: 'semi-finished-products', endpoint: '/api/v1/semi-finished-products' },
  { label: 'Thành phẩm', key: 'products', endpoint: '/api/v1/products' },
];

const MaterialManagementPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);
  const [existingCodes, setExistingCodes] = useState([]);
  const handleAddClick = () => {
    form.resetFields();
    setEditingItem(null);
    setModalVisible(true);
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = tabs[activeTab].endpoint;
      const res = await axios.get(`http://localhost:3030${endpoint}`);

      const keyMap = {
        materials: 'materials',
        'semi-finished-products': 'semiProducts',
        products: 'products',
      };

      const idFieldMap = {
        materials: 'material_id',
        'semi-finished-products': 'semi_product_id',
        products: 'product_id',
      };

      const key = keyMap[tabs[activeTab].key];
      const idField = idFieldMap[tabs[activeTab].key];
      const rawData = res?.data?.[key] || [];

      const cleanedData = rawData.map((item) => ({
        ...item,
        id: item[idField],
      })).filter((item) => item.id && item.status === 'active');

      setData(cleanedData);
      setExistingCodes(cleanedData.map((item) => item.code)); // Lưu tất cả code

    } catch (err) {
      console.error('Fetch error:', err.response || err.message || err);
      message.error('Lỗi khi tải dữ liệu');
      setData([]);
      setExistingCodes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Prevent unnecessary fetches if activeTab hasn't changed
    let isMounted = true;
    fetchData().then(() => {
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false; // Cleanup to prevent state updates after unmount
    };
  }, [activeTab]); // Only re-run when activeTab changes

  const handleEdit = (item) => {
    if (!item.id) {
      message.error('Không tìm thấy ID của mục này');
      return;
    }
    setEditingItem(item);
    form.setFieldsValue({
      code: item.code,
      name: item.name,
      unit: item.unit,
      status: item.status || 'active',
    });
    setModalVisible(true);
  };

  const handleDelete = (item) => {
    if (!item.id) {
      message.error('Không tìm thấy ID của mục này');
      return;
    }

    confirm({
      title: 'Bạn có chắc chắn muốn xóa?',
      icon: <ExclamationCircleOutlined />,
      content: `Mã: ${item.code} - ${item.name}`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const endpoint = tabs[activeTab].endpoint;

          // Xác định đúng ID field (trong trường hợp bán thành phẩm có ID riêng)
          const id =
            tabs[activeTab].key === 'semi-finished-products'
              ? item.semi_product_id
              : item.id;

          // Gọi API xóa
          await axios.put(`http://localhost:3030${endpoint}/${id}`, { status: 'inactive' });

          message.success('Đã chuyển trạng thái sang "inactive"');
          fetchData(); // Load lại dữ liệu
        } catch (err) {
          console.error('Delete error:', err.response || err);
          message.error(`Lỗi khi xóa: ${err.response?.data?.message || err.message}`);
        }
      },
    });
  };


  const handleSubmit = async (values) => {
    try {
      const endpoint = tabs[activeTab].endpoint;

      if (editingItem) {
        const id =
          tabs[activeTab].key === 'semi-finished-products'
            ? editingItem.semi_product_id
            : editingItem.id;
        await axios.put(`http://localhost:3030${endpoint}/${id}`, values);
        message.success('Cập nhật thành công');
      } else {
        await axios.post(`http://localhost:3030${endpoint}`, values);
        message.success('Thêm mới thành công');
      }

      setModalVisible(false);
      fetchData();
    } catch (err) {
      console.error('Submit error:', err.response || err);
      message.error(`Lỗi khi lưu: ${err.response?.data?.message || err.message}`);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Mã', dataIndex: 'code' },
    { title: 'Tên', dataIndex: 'name' },
    { title: 'Đơn vị', dataIndex: 'unit' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status || 'unknown'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa mục này?"
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
    
  ];

  return (
    <Spin spinning={loading} tip="Loading...">
      <ProductTableLayout
        title="Quản lý vật tư, bán thành phẩm, thành phẩm"
        tabs={tabs.map((t) => t.label)}
        activeTab={activeTab}
        onTabChange={(i) => setActiveTab(i)}
        searchPlaceholder="Tìm kiếm..."
        showAddButton={true}
        onAddClick={handleAddClick} // Ensure this matches ProductTableLayout's prop
        columns={columns}
        data={data}
      />
      <Modal
        title={editingItem ? 'Cập nhật' : 'Thêm mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText={editingItem ? 'Lưu' : 'Thêm'}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="code"
            label="Mã"
            rules={[
              { required: true, message: 'Vui lòng nhập mã' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();

                  const isDuplicate = existingCodes.includes(value);
                  const isEditingSameCode = editingItem && editingItem.code === value;

                  if (isDuplicate && !isEditingSameCode) {
                    return Promise.reject(new Error('Mã đã tồn tại'));
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Nhập mã" />
          </Form.Item>
          <Form.Item name="name" label="Tên" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="unit" label="Đơn vị" rules={[{ required: true, message: 'Vui lòng nhập đơn vị' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
            <Select>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Ngừng hoạt động</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Spin>
  );
};

export default MaterialManagementPage;