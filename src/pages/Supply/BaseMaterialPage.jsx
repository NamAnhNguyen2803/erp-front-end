
// src/components/BaseMaterialPage.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Spin, Button, Tag, message, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import ProductTableLayout from '@/components/ProductTableLayout';
import { STATUS, STATUS_LABELS, STATUS_COLORS } from '@/constants/supplyType.enum';
const { Option } = Select;
const { confirm } = Modal;


const BaseMaterialPage = ({ title, api, idField, customColumns, onRow }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingItem, setEditingItem] = useState(null);
    const [existingCodes, setExistingCodes] = useState([]);
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get();
            const rawData = Object.values(res.data)[0] || [];
            const cleaned = rawData
                .map((item) => ({ ...item, id: item[idField] }))
            // .filter((item) => item.id && item.status === 'active');
            setData(cleaned);
            setExistingCodes(cleaned.map((i) => i.code));
        } catch (err) {
            message.error('Lỗi khi tải dữ liệu');
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAddClick = () => {
        form.resetFields();
        setEditingItem(null);
        setModalVisible(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        form.setFieldsValue(item);
        setModalVisible(true);
    };

    const handleDelete = (item) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa?',
            icon: <ExclamationCircleOutlined />,
            content: `${item.code} - ${item.name}`,
            okType: 'danger',
            onOk: async () => {
                try {
                    await api.remove(item[idField]);
                    message.success('Đã chuyển trạng thái sang "inactive"');
                    fetchData();
                } catch (err) {
                    message.error('Lỗi khi xóa');
                }
            },
        });
    };

    const handleSubmit = async (values) => {
        console.log('[DEBUG] Submit values:', values);
        if (editingItem) {
            console.log('[DEBUG] Updating ID:', editingItem[idField]);
        }
        try {
            if (editingItem) {
                await api.update(editingItem[idField], values);
                message.success('Cập nhật thành công');
            } else {
                await api.create(values);
                message.success('Thêm mới thành công');
            }
            setModalVisible(false);
            fetchData();
        } catch (err) {
            message.error('Lỗi khi lưu');
        }
    };

    const defaultColumns = [
        { title: 'ID', dataIndex: 'id' },
        { title: 'Mã', dataIndex: 'code' },
        { title: 'Tên', dataIndex: 'name' },
        { title: 'Đơn vị', dataIndex: 'unit' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => (
                <Tag color={STATUS_COLORS[status]}>
                    {STATUS_LABELS[status] || 'Không rõ'}
                </Tag >
            ),
        },
        {
            title: 'Hành động',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm
                        title="Bạn có chắc muốn xóa?"
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
        <Spin spinning={loading}>
            <ProductTableLayout
                title={title}
                showAddButton
                onAddClick={handleAddClick}
                columns={Array.isArray(customColumns) ? [...defaultColumns, ...customColumns] : defaultColumns}
                data={data}
                onRow={onRow || (() => ({}))}
            />
            <Modal
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={() => form.submit()}
                title={editingItem ? 'Cập nhật' : 'Thêm mới'}
                okText={editingItem ? 'Lưu' : 'Thêm'}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ status: 'active' }}>
                    <Form.Item name="code" label="Mã" rules={[{ required: true, message: 'Bắt buộc' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="unit" label="Đơn vị" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="specification" label="Thông số kỹ thuật">
                        <Input />
                    </Form.Item>
                    <Form.Item name="unit_price" label="Giá trị">
                        <Input />
                    </Form.Item>
                    <Form.Item name="supplier" label="Nhà cung cấp">
                        <Input />
                    </Form.Item>
                    <Form.Item name="status" label="Trạng thái">
                        <Select>
                            {Object.entries(STATUS_LABELS).map(([value, label]) => (
                                <Option key={value} value={value}>{label}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Spin>
    );
};

export default BaseMaterialPage;