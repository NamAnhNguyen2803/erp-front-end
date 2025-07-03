import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Descriptions, Card, Table, Tag, Typography, Spin, Divider } from 'antd';
import axios from 'axios';
import { getMaterialById } from '../../../api/materials';
import { get } from 'lodash-es';
const { Title } = Typography;
import { getInventoryByMaterialId } from '@/api/inventory';
const MaterialDetailPage = () => {
    const { material_id } = useParams();
    const [material, setMaterial] = useState(null);
    const [stockInfo, setStockInfo] = useState([]);
    const [bomUsage, setBomUsage] = useState([]);
    const [statusByWorkOrder, setStatusByWorkOrder] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [materialRes, stockRes, bomRes, statusRes] = await Promise.all([
                    getMaterialById(material_id),
                    getInventoryByMaterialId(material_id),
                    axios.get(`/api/v1/bom-items/materials/${material_id}`),
                    axios.get(`/api/v1/work-orders/material-status/${material_id}`),
                ]);
                setMaterial(materialRes.data);
                console.log('Material data:', materialRes.data);
                setStockInfo(stockRes.data.data || []);
                console.log('Stock info:', stockRes.data.data);
                setBomUsage(bomRes.data);
                setStatusByWorkOrder(statusRes.data);
            } catch (err) {
                console.error('Lỗi khi tải dữ liệu:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [material_id]);

    const statusColors = {
        ready: 'green',
        partial: 'orange',
        pending: 'red',
        allocated: 'blue',
        consumed: 'purple',
    };

    return (
        <Spin spinning={loading}>
            <Title level={2}>Chi tiết Nguyên vật liệu</Title>

            {/* I. Thông tin cơ bản */}
            <Card title="I. Thông tin cơ bản" style={{ marginBottom: 24 }}>
                {material && (
                    <Descriptions column={2} bordered>
                        <Descriptions.Item label="Mã nguyên liệu">{material.code}</Descriptions.Item>
                        <Descriptions.Item label="Tên nguyên liệu">{material.name}</Descriptions.Item>
                        <Descriptions.Item label="Đơn vị">{material.unit}</Descriptions.Item>
                        <Descriptions.Item label="Nhà cung cấp">{material.supplier}</Descriptions.Item>
                        <Descriptions.Item label="Thông số kỹ thuật">{material.specification}</Descriptions.Item>
                        <Descriptions.Item label="Đơn giá">{material.unit_price}</Descriptions.Item>
                        <Descriptions.Item label="Tồn kho tối thiểu">{material.min_stock}</Descriptions.Item>
                        <Descriptions.Item label="Tồn kho tối đa">{material.max_stock}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color={material.status === 'active' ? 'green' : 'red'}>{material.status}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">
                            {new Date(material.createdAt).toLocaleString('vi-VN')}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày cập nhật">
                            {new Date(material.updatedAt).toLocaleString('vi-VN')}
                        </Descriptions.Item>

                    </Descriptions>
                )}
            </Card>

            {/* II. Tồn kho nguyên vật liệu */}
            <Card title="II. Thông tin Tồn kho" style={{ marginBottom: 24 }}>
                <Table
                    dataSource={Array.isArray(stockInfo) ? stockInfo : []}
                    rowKey="warehouse_id"
                    pagination={false}
                    columns={[
                        { title: 'Mã nguyên liệu', dataIndex: ['Material', 'code'] },
                        { title: 'Kho', dataIndex: ['Warehouse', 'name'] },
                        { title: 'Tên vật tư', dataIndex: ['Material', 'name'] },
                        { title: 'Số lượng tồn', dataIndex: 'quantity' },
                        { title: 'Đơn vị', dataIndex: 'unit' },
                    ]}
                />
            </Card>

            {/* III. Sử dụng trong BOM */}
            <Card title="III. Sử dụng trong BOM" style={{ marginBottom: 24 }}>
                <Table
                    dataSource={Array.isArray(bomUsage) ? bomUsage : []}
                    rowKey="bom_id"
                    pagination={false}
                    columns={[
                        { title: 'Sản phẩm', dataIndex: 'product_name' },
                        { title: 'Số lượng cần thiết', dataIndex: 'quantity' },
                        { title: 'Hao hụt (%)', dataIndex: 'waste_percent' },
                        { title: 'Phiên bản', dataIndex: 'version' },
                        { title: 'Đang hoạt động', dataIndex: 'is_active', render: val => val ? '✅' : '❌' },
                    ]}
                />
            </Card>

            {/* IV. Tình trạng theo lệnh sản xuất */}
            <Card title="IV. Tình trạng theo Lệnh sản xuất">
                <Table
                    dataSource={Array.isArray(statusByWorkOrder) ? statusByWorkOrder : []}
                    rowKey="work_order_id"
                    pagination={false}
                    columns={[
                        { title: 'Lệnh sản xuất', dataIndex: 'work_order_code' },
                        { title: 'Số lượng cần', dataIndex: 'required_quantity' },
                        { title: 'Số lượng có sẵn', dataIndex: 'available_quantity' },
                        { title: 'Thiếu hụt', dataIndex: 'shortage_quantity' },
                        { title: 'Trạng thái', dataIndex: 'status', render: val => <Tag color={statusColors[val]}>{val}</Tag> },
                        { title: 'Đã phân bổ', dataIndex: 'allocated_quantity' },
                        { title: 'Đã tiêu thụ', dataIndex: 'consumed_quantity' },
                    ]}
                />
            </Card>

            <Divider />
            <Card title="V. Quản lý & Truy xuất">
                <p>Hệ thống hỗ trợ quản lý bán thành phẩm, định mức nguyên vật liệu, truy xuất nguồn gốc và tự động trừ vật tư.</p>
                <p>Thông tin này giúp tối ưu quy trình sản xuất và kiểm soát chất lượng.</p>
            </Card>
        </Spin>
    );
};

export default MaterialDetailPage;