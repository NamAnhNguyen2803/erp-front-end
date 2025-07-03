import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Card,
  Modal,
  Form,
  message,
  Select,
  InputNumber,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  getAllBoms,
  createBom,
  getBomById,
  updateBom,
  deleteBom,

} from '@/api/bomApi';
import {
    createBomItem,
} from '@/api/boms';
import { getMaterials } from '@/api/materials';
import { getProducts } from '@/api/products';
import BomItemsTreeTable from '@/components/BomItemsTreeTable';
import { get } from 'lodash-es';
import BOMItemForm from './BomItemsForm';
const { Search } = Input;
const { Option } = Select;

const BomsProductsPage = () => {
  const [boms, setBoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isItemModalVisible, setIsItemModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [itemForm] = Form.useForm();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [currentBomId, setCurrentBomId] = useState(null);
  const [originalBoms, setOriginalBoms] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [products, setProducts] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingBom, setEditingBom] = useState(null);
  const [orderMap, setOrderMap] = useState({});

  const fetchBoms = async () => {
    setLoading(true);
    try {
      const res = await getAllBoms({ page: 1, limit: 100 });
      const detailed = await Promise.all(
        res.boms.map(async (bom) => {
          if (!bom?.bom_id) return bom;
          const details = await getBomById(bom.bom_id);
          return { ...bom, ...details };
        })
      );
      setBoms(detailed);
      setOriginalBoms(detailed);
    } catch (err) {
      message.error('Lỗi khi tải BOM');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchBoms();
  }, []);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await getMaterials();
        setMaterials(Array.isArray(res.data) ? res.data : res.data.materials || []);
      } catch (err) {
        message.error('Lỗi khi tải nguyên vật liệu');
        console.error(err);
      }
    };

    fetchMaterials();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts(); // API trả về danh sách products
        setProducts(Array.isArray(res.data) ? res.data : res.data.products || []);
      } catch (err) {
        message.error('Lỗi khi tải sản phẩm');
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (value) => {
    if (!value) {
      setBoms(originalBoms);
      return;
    }
    const filtered = originalBoms.filter((bom) =>
      bom.product?.name?.toLowerCase().includes(value.toLowerCase())
    );
    setBoms(filtered);
  };

  const openAddItemModal = (bomId) => {
    setCurrentBomId(bomId);
    setIsItemModalVisible(true);
  };

  useEffect(() => {
    if (isItemModalVisible) {
      itemForm.resetFields();
    }
  }, [isItemModalVisible]);


  const handleAddBomItem = async () => {
    try {
      const values = await itemForm.validateFields();

      const payload = {
        bom_id: currentBomId,
        item_type: values.item_type,
        reference_id: values.reference_id,
        bom_level: values.bom_level,
        reference: values.reference || '',
        quantity: values.quantity,
        waste_percent: values.waste_percent || 0,
        notes: values.notes || '',
      };

      await createBomItem(payload);

      message.success('Thêm item vào BOM thành công');
      itemForm.resetFields();
      setIsItemModalVisible(false);
      fetchBoms();
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi thêm item vào BOM');
    }
  };


  const handleCreateBom = async (values) => {
    try {
      await createBom({ ...values, items: [] });
      message.success('Tạo BOM thành công');
      setIsCreateModalVisible(false);
      form.resetFields();
      fetchBoms();
    } catch {
      message.error('Tạo BOM thất bại');
    }
  };

  const handleDeleteBom = async (bomId) => {
    try {
      await deleteBom(bomId);
      message.success('Xóa BOM thành công');
      fetchBoms();
    } catch {
      message.error('Xóa BOM thất bại');
    }
  };

  const openEditModal = (bom) => {
    setEditingBom(bom);
    form.setFieldsValue({
      product_id: bom.product_id,
      version: bom.version,
      plan_id: bom.plan_id,
      notes: bom.notes,
    });
    setIsEditModalVisible(true);
  };

  const handleUpdateBom = async () => {
    try {
      const values = await form.validateFields();
      await updateBom(editingBom.bom_id, {
        bom_id: editingBom.bom_id,
        ...values,
        items: editingBom.items || [],
      });
      message.success('Cập nhật BOM thành công');
      setIsEditModalVisible(false);
      setEditingBom(null);
      fetchBoms();
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error('Cập nhật BOM thất bại');
    }
  };

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: ['Product', 'name'],
      key: 'product_name',
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Người tạo',
      dataIndex: ['User', 'username'],
      key: 'created_by',
    },
    {
      title: 'Thuộc đơn hàng',
      dataIndex: ['ManufacturingOrder', 'order_code'],
      key: 'order_code',
    },

    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button onClick={() => openAddItemModal(record.bom_id)} disabled={loading}>
            + Nguyên vật liệu
          </Button>

          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            disabled={loading}

          />
          <Popconfirm
            title="Bạn có chắc muốn xóa BOM này?"
            onConfirm={() => handleDeleteBom(record.bom_id)}
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
    <div style={{ padding: 0 }}>
      <Card>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 16,
            marginTop: 0,
          }}
        >
          <h1>Danh sách BOM</h1>
          <Space>
            <Search
              placeholder="Tìm theo tên sản phẩm"
              onSearch={handleSearch}
              allowClear
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalVisible(true)}
            >
              Tạo BOM
            </Button>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={boms}
          loading={loading}
          rowKey="bom_id"
          expandable={{
            expandedRowRender: (record) => (
              <BomItemsTreeTable items={record.items} />
            ),
            onExpand: (expanded, record) => {
              setExpandedRowKeys(expanded ? [record.bom_id] : []);
            },
            expandedRowKeys,
          }}
        />
      </Card>

      {/* Modal thêm nguyên vật liệu */}
      <Modal
        title="Thêm nguyên vật liệu"
        open={isItemModalVisible}
        onCancel={() => {
          setIsItemModalVisible(false);
          setCurrentBomId(null);
        }}
        onOk={handleAddBomItem}
        okText="Thêm"
        cancelText="Hủy"
        width={600}
      >
        <BOMItemForm
          form={itemForm}
          onSubmit={handleAddBomItem}
        />
      </Modal>

      {/* Modal tạo BOM mới */}
      <Modal
        title="Tạo BOM mới"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onOk={() => handleCreateBom()}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleCreateBom}  onSubmit={handleCreateBom}>
          <Form.Item
            name="product_id"
            label="Sản phẩm"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Chọn sản phẩm"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {products.map(product => (
                <Option key={product.product_id} value={product.product_id}>
                  {product.code} - {product.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="version"
            label="Phiên bản"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="plan_id"
            label="Kế hoạch"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tạo BOM
            </Button>
          </Form.Item>
        </Form>
      </Modal>


      {/* Modal chỉnh sửa BOM */}
      <Modal
        title="Chỉnh sửa BOM"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingBom(null);
        }}
        onOk={handleUpdateBom}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="product_id"
            label="Sản phẩm"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Chọn sản phẩm"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {products.map(product => (
                <Option key={product.product_id} value={product.product_id}>
                  {product.code} - {product.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="version" label="Phiên bản" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="order_id" label="Kế hoạch" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default BomsProductsPage;
