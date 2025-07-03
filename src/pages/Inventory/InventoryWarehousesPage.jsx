import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  getInventoryByWarehouseId,
} from '../../api/inventory';

const InventoryWarehousesPage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [form] = Form.useForm();

  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);

  // Load danh sách kho
  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const res = await getWarehouses();
      // Giả sử res.data.warehouses là mảng kho
      setWarehouses(res.data.warehouses.map(item => ({ ...item, key: item.warehouse_id || item.id })));
    } catch {
      message.error('Lỗi khi tải danh sách kho');
    } finally {
      setLoading(false);
    }
  };

  // Load tồn kho theo warehouse id
  const fetchInventory = async (warehouseId) => {
    setInventoryLoading(true);
    try {
      const res = await getInventoryByWarehouseId(warehouseId);
      const rawData = res.data?.materials || [];
      const materials = res.data?.materials || [];
      const semiProducts = res.data?.semiProducts || [];
      const products = res.data?.products || [];

      const mappedInventory = [
        ...materials.map(item => ({
          key: `m-${item.inventory_id}`,
          code: item.Material?.code || '',
          name: item.Material?.name || '',
          quantity: item.quantity,
          unit: item.unit || item.Material?.unit || '',
          type: 'Nguyên vật liệu',
          warehouse: item.Warehouse?.name || '',
        })),
        ...semiProducts.map(item => ({
          key: `s-${item.inventory_id}`,
          code: item.SemiProduct?.code || '',
          name: item.SemiProduct?.name || '',
          quantity: item.quantity,
          unit: item.unit || item.SemiProduct?.unit || '',
          type: 'Bán thành phẩm',
          warehouse: item.Warehouse?.name || '',
        })),
        ...products.map(item => ({
          key: `p-${item.inventory_id}`,
          code: item.Product?.code || '',
          name: item.Product?.name || '',
          quantity: item.quantity,
          unit: item.unit || item.Product?.unit || '',
          type: 'Thành phẩm',
          warehouse: item.Warehouse?.name || '',
        })),
      ];

      setInventory(mappedInventory);


      console.log('Tồn kho:', res.data);
    } catch (error) {
      console.log(error);
      message.error('Lỗi khi tải tồn kho');
    } finally {
      setInventoryLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  // Khi click kho -> lấy tồn kho + đánh dấu selected
  const onRowClick = (record) => {
    setSelectedWarehouseId(record.warehouse_id || record.id);
    fetchInventory(record.warehouse_id || record.id);
  };

  const handleAdd = () => {
    setEditingWarehouse(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingWarehouse(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteWarehouse(id);
      message.success('Xóa kho thành công');
      fetchWarehouses();
      // Nếu xóa kho đang xem tồn kho, reset tồn kho
      if (id === selectedWarehouseId) {
        setSelectedWarehouseId(null);
        setInventory([]);
      }
    } catch {
      message.error('Xóa kho thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (editingWarehouse) {
        await updateWarehouse(editingWarehouse.warehouse_id || editingWarehouse.id, values);
        message.success('Cập nhật kho thành công');
      } else {
        await createWarehouse(values);
        message.success('Thêm kho thành công');
      }
      setModalVisible(false);
      fetchWarehouses();
    } catch (err) {
      if (err && err.errorFields) return;
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const warehouseColumns = [
    {
      title: 'ID',
      dataIndex: 'warehouse_id',
      key: 'warehouse_id',
    },
    {
      title: 'Tên kho',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.warehouse_id || record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const inventoryColumns = [
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Kho',
      dataIndex: 'warehouse',
      key: 'warehouse',
    },
  ];



  return (
    <div>
      <h1>Kho hàng</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={handleAdd}
      >
        Thêm kho
      </Button>
      <Table
        columns={warehouseColumns}
        dataSource={warehouses}
        loading={loading}
        onRow={record => ({
          onClick: () => onRowClick(record),
          style: selectedWarehouseId === (record.warehouse_id || record.id) ? { backgroundColor: '#e6f7ff' } : {},
        })}
        pagination={false}
        rowKey={record => record.warehouse_id || record.id}
      />

      {selectedWarehouseId && (
        <>
          <h2 style={{ marginTop: 32 }}>Tồn kho kho ID: {selectedWarehouseId}</h2>
          <Table
            columns={inventoryColumns}
            dataSource={inventory}
            loading={inventoryLoading}
            pagination={false}
            size="small"
            rowKey={record => record.id || record.product_id}
          />
        </>
      )}

      <Modal
        title={editingWarehouse ? 'Sửa kho' : 'Thêm kho'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okText={editingWarehouse ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên kho"
            rules={[{ required: true, message: 'Vui lòng nhập tên kho' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng nhập trạng thái' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryWarehousesPage;
