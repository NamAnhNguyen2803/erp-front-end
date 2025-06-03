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
} from '../api/bomApi';
import { getMaterials } from '../api/materials';
import BomItemsTreeTable from '../components/BomItemsTreeTable';

const { Search } = Input;
const { Option } = Select;

const BomsSemiProductsPage = () => {
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
        console.log(materials);
      } catch (err) {
        message.error('Lỗi khi tải nguyên vật liệu');
        console.error(err);
      }
    };

    fetchMaterials();
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
      const bom = await getBomById(currentBomId);
      const newItem = {
        ...values,
        item_type: 'material',
        reference: materials.find(m => m.product_id === values.material_id)?.code || '',
        bom_level: 1,
      };
      const newItems = [...(bom.items || []), newItem];

      await updateBom(currentBomId, {
        version: bom.version,
        notes: bom.notes,
        items: newItems,
      });

      message.success('Thêm nguyên vật liệu thành công');
      setIsItemModalVisible(false);
      fetchBoms();
    } catch (error) {
      message.error('Lỗi khi thêm nguyên vật liệu');
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
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button onClick={() => openAddItemModal(record.bom_id)} disabled={loading}>
            + Nguyên vật liệu
          </Button>

          <Button icon={<EditOutlined />} disabled />
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
    <div style={{ padding: 0}}>
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
        <Form layout="vertical" form={itemForm}>
          <Form.Item name="material_id" label="Nguyên vật liệu" rules={[{ required: true }]}>
            <Select placeholder="Chọn nguyên vật liệu">
              {materials.map((material) => (
                <Option key={material.material_id} value={material.material_id}>
                  {material.code} - {material.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="quantity" label="Số lượng" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="waste_percent" label="% Hao hụt">
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="notes" label="Ghi chú">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal tạo BOM mới */}
      <Modal
        title="Tạo BOM mới"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleCreateBom}>
          <Form.Item
            name="product_id"
            label="ID sản phẩm"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="version"
            label="Phiên bản"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="created_by"
            label="ID người tạo"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tạo BOM
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BomsSemiProductsPage;
