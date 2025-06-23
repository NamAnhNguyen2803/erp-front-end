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
import {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSemiProducts,
  createSemiProduct,
  updateSemiProduct,
  deleteSemiProduct,
} from '@/api/materials'; // Đường dẫn tuỳ theo cấu trúc project của bạn
import { STATUS, STATUS_LABELS } from '../../constants/supplyType.enum';
const { Option } = Select;
const { confirm } = Modal;

const tabs = [
  {
    label: 'Vật tư',
    key: 'materials',
    get: getMaterials,
    create: createMaterial,
    update: updateMaterial,
    remove: deleteMaterial,
    idField: 'material_id',
  },
  {
    label: 'Bán thành phẩm',
    key: 'semi-finished-products',
    get: getSemiProducts,
    create: createSemiProduct,
    update: updateSemiProduct,
    remove: deleteSemiProduct,
    idField: 'semi_product_id',
  },
  {
    label: 'Thành phẩm',
    key: 'products',
    get: getProducts,
    create: createProduct,
    update: updateProduct,
    remove: deleteProduct,
    idField: 'product_id',
  },
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
      const tab = tabs[activeTab];
      const res = await tab.get();
      const dataKeyMap = {
        materials: 'materials',
        'semi-finished-products': 'semiProducts',
        products: 'products',
      };

      const key = dataKeyMap[tab.key];
      const rawData = res?.data?.[key] || [];

      const cleanedData = rawData
        .map((item) => {
          return { ...item, id: item[tab.idField] };
        })
        .filter((item) => item.id && item.status === 'active');

      console.log('Fetched raw data:', rawData);
      setData(cleanedData);
      setExistingCodes(cleanedData.map((item) => item.code));
    } catch (err) {
      console.error('Fetch error:', err);
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
      specification: item.specification,
      unit_price: item.unit_price,
      supplier: item.supplier,
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
          await deleteProduct(item.id);

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
    const tab = tabs[activeTab];
    try {
      if (editingItem) {
        const id = editingItem[tab.idField];
        await tab.update(id, values);
        message.success('Cập nhật thành công');
      } else {
        await tab.create(values);
        message.success('Thêm mới thành công');
      }

      setModalVisible(false);
      fetchData();
    } catch (err) {
      console.error('Submit error:', err);
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
      render: (status) => {
        const label = STATUS_LABELS[status] || 'Không rõ';
        const color = status === STATUS.ACTIVE ? 'green' : 'red';

        return <Tag color={color}>{label}</Tag>;

      },
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
        title="Quản lý vật tư"
        tabs={tabs.map((t) => t.label)}
        activeTab={activeTab}
        onTabChange={(i) => setActiveTab(i)}
        searchPlaceholder="Tìm kiếm..."
        showAddButton={true}
        onAddClick={handleAddClick}
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
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{
          status: 'active',
        }}>
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
          <Form.Item name="specification" label="Thông số kĩ thuật" rules={[{ required: false }]}>
            <Input />
          </Form.Item>
          <Form.Item name="unit_price" label="Giá trị" rules={[{ required: false }]}>
            <Input />
          </Form.Item>
          <Form.Item name="supplier" label="Nhà cung cấp" rules={[{ required: false }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: false, message: 'Vui lòng chọn trạng thái' }]}>
            <Select>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <Option key={value} value={value}>
                  {label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Spin>
  );
};

export default MaterialManagementPage;