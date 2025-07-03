import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Descriptions, Card, Table, Tag, Typography, Spin, Divider } from 'antd';
import axios from 'axios';
import { getProductById } from '@/api/products';
import { getInventoryByProductId } from '@/api/inventory';
import BomItemsTreeTable from '@/components/BomItemsTreeTable'; // Assuming you have this component for displaying BOM items

const { Title } = Typography;

const ProductDetailPage = () => {
    const { product_id } = useParams();
    const [product, setProduct] = useState(null);
    const [stockInfo, setStockInfo] = useState([]);
    const [bomDetail, setBomDetail] = useState([]);
    const [bomItemsTreeTable, setBomItemsTreeTable] = useState([]);
    const [statusByWorkOrder, setStatusByWorkOrder] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [productRes, stockRes, statusRes] = await Promise.all([
                    getProductById(product_id),
                    getInventoryByProductId(product_id),
                    axios.get(`/api/v1/work-orders/product-status/${product_id}`),
                ]);

                const productData = productRes.data.data;

                setProduct(productData);
                setStockInfo(stockRes.data.data || []);
                setBomDetail(productData?.BOMs || []);
                setStatusByWorkOrder(statusRes.data || []);
                setBomItemsTreeTable(productData.BOMs?.[0]?.BOMItems || []);
                console.log('Product data:', productData);
                console.log('Stock info:', bomDetail);
            } catch (err) {
                console.error('Lỗi khi tải dữ liệu sản phẩm:', err);
            } finally {
                setLoading(false);
            }
        };


        fetchAll();
    }, [product_id]);

    const statusColors = {
        ready: 'green',
        partial: 'orange',
        pending: 'red',
        allocated: 'blue',
        produced: 'purple',
    };

    return (
        <Spin spinning={loading}>
            <Title level={2}>Chi tiết Sản phẩm</Title>

            {/* I. Thông tin cơ bản */}
            <Card title="I. Thông tin cơ bản" style={{ marginBottom: 24 }}>
                {product && (
                    <Descriptions column={2} bordered>
                        <Descriptions.Item label="Mã thành phẩm">{product.code}</Descriptions.Item>
                        <Descriptions.Item label="Tên thành phẩm">{product.name}</Descriptions.Item>
                        <Descriptions.Item label="Đơn vị">{product.unit}</Descriptions.Item>
                        <Descriptions.Item label="Loại">{product.category}</Descriptions.Item>
                        <Descriptions.Item label="Thông số kỹ thuật">{product.specification}</Descriptions.Item>
                        <Descriptions.Item label="Giá bán">{product.unit_price}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color={product.status === 'active' ? 'green' : 'red'}>{product.status}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">
                            {new Date(product.createdAt).toLocaleString('vi-VN')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày cập nhật">
                            {new Date(product.updatedAt).toLocaleString('vi-VN')}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Card>

            {/* II. Tồn kho sản phẩm */}
            <Card title="II. Tồn kho sản phẩm" style={{ marginBottom: 24 }}>
                <Table
                    dataSource={Array.isArray(stockInfo) ? stockInfo : []}
                    rowKey="warehouse_id"
                    pagination={false}
                    columns={[
                        { title: 'Mã thành phẩm', dataIndex: ['Product', 'code'] },
                        { title: 'Kho', dataIndex: ['Warehouse', 'name'] },
                        { title: 'Tên sản phẩm', dataIndex: ['Product', 'name'] },
                        { title: 'Số lượng tồn', dataIndex: 'quantity' },
                        { title: 'Đơn vị', dataIndex: 'unit' },
                    ]}
                />
            </Card>

            {/* III. Định mức BOM */}
            <Card title="III. Định mức BOM" style={{ marginBottom: 24 }}>
                <Table
                    dataSource={Array.isArray(bomDetail) ? bomDetail : []}
                    rowKey="bom_id"
                    pagination={false}
                    columns={[
                        { title: 'Tên nguyên vật liệu', dataIndex: 'item_name' },
                        { title: 'Loại', dataIndex: 'item_type' },
                        { title: 'Kế hoạch', dataIndex: 'order_id' },
                        { title: 'Hao hụt (%)', dataIndex: 'waste_percent' },
                        { title: 'Phiên bản BOM', dataIndex: 'version' },
                        { title: 'Hoạt động', dataIndex: 'is_active', render: val => val ? '✅' : '❌' },
                    ]}
                    expandable={{
                        expandedRowRender: (record) => (
                            <BomItemsTreeTable items={record.BOMItems || []} />
                        ),
                        onExpand: (expanded, record) => {
                            setExpandedRowKeys(expanded ? [record.bom_id] : []);
                        },
                        expandedRowKeys,
                    }}
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
                        { title: 'Đã phân bổ', dataIndex: 'allocated_quantity' },
                        { title: 'Đã sản xuất', dataIndex: 'produced_quantity' },
                        { title: 'Thiếu hụt', dataIndex: 'shortage_quantity' },
                        { title: 'Trạng thái', dataIndex: 'status', render: val => <Tag color={statusColors[val]}>{val}</Tag> },
                    ]}
                />
            </Card>

            <Divider />
            <Card title="V. Ghi chú & Quản lý">
                <p>Thông tin này giúp giám sát hiệu quả sản xuất, kiểm soát tồn kho và truy xuất nguồn gốc sản phẩm thành phẩm.</p>
                <p>Chỉ cần một cú click — toàn bộ dữ liệu nằm trong tay bạn.</p>
            </Card>
        </Spin>
    );
};

export default ProductDetailPage;
