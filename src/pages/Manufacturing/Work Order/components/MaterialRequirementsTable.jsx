import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, InputNumber, message, Typography, Tag, Card, Row, Col, Radio } from 'antd';
import { MANUFACTURING_ORDER_STATUS_LABELS, MANUFACTURING_ORDER_STATUS_COLORS } from '@/constants/manufacturingStatus.enum';
import { PlusOutlined, SwapOutlined } from '@ant-design/icons';
import { transferGoods, importGoods } from '../../../../api/inventory';

const { Text } = Typography;
const MaterialRequirementsTable = ({ 
  materialData, 
  workOrderData,
  bomData,
  workOrderId, 
  onRefresh 
}) => {
  const [importModal, setImportModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [importQuantity, setImportQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [processedData, setProcessedData] = useState([]);
  const [actionType, setActionType] = useState('import'); // 'import' hoặc 'transfer'

  // Map lại dữ liệu để đảm bảo đồng bộ và tránh lỗi render
  useEffect(() => {
    if (!Array.isArray(materialData)) {
      setProcessedData([]);
      return;
    }

    const mappedData = materialData.map(m => ({
      material_id: m.material_id || m.id || '',
      material_name: m.material_name || m.name || 'Unknown',
      required_quantity: Number(m.required_quantity ?? m.req_qty ?? 0),
      warehouse1_stock: Number(m.warehouse1_stock ?? m.wh1_stock ?? 0),
      production_stock: Number(m.production_stock ?? m.prod_stock ?? 0),
      total_stock: Number(m.total_stock ?? m.total ?? 0),
      unit: m.unit || 'N/A',
      bom_quantity_per_unit: Number(m.bom_quantity_per_unit ?? 0),
    }));

    setProcessedData(mappedData);
  }, [materialData]);

  const handleAction = (material, type) => {
    setSelectedMaterial(material);
    setActionType(type);
    setImportQuantity(0);
    setImportModal(true);
  };

  const handleConfirmAction = async () => {
    if (!importQuantity || importQuantity <= 0) {
      message.error('Vui lòng nhập số lượng hợp lệ');
      return;
    }

    setLoading(true);
    try {
      if (actionType === 'transfer') {
        // Chuyển kho từ kho 1 sang kho 2 (sản xuất)
        const transferData = {
          from_warehouse_id: 1,
          to_warehouse_id: 2,
          item_type: "material",
          item_id: selectedMaterial.material_id,
          quantity: importQuantity,
          unit: selectedMaterial.unit,
          transaction_type: "transfer",
          reference_type: "work_order",
          reference_id: workOrderId,
          description: `Chuyển nguyên liệu ${selectedMaterial.material_name} cho WO ${workOrderData?.work_code || workOrderId}`,
          created_by: 1 // Có thể lấy từ user context
        };

        await transferGoods(transferData);
        message.success('Chuyển kho thành công');
      } else {
        // Nhập nguyên liệu vào kho nguyên liệu (kho 1)
        const importData = {
          item_id: selectedMaterial.material_id,
          item_type: "material",
          to_warehouse_id: 1,
          quantity: importQuantity
        };

        await importGoods(importData);
        message.success('Nhập kho nguyên liệu thành công');
      }

      setImportModal(false);
      onRefresh?.();
    } catch (error) {
      message.error(actionType === 'transfer' ? 'Chuyển kho thất bại' : 'Nhập kho thất bại');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Tên nguyên vật liệu',
      dataIndex: 'material_name',
      key: 'material_name',
      width: 250,
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
      align: 'center',
    },
    {
      title: 'SL/SP',
      dataIndex: 'bom_quantity_per_unit',
      key: 'bom_quantity_per_unit',
      width: 80,
      align: 'right',
      render: (value) => <Text>{value.toLocaleString()}</Text>,
    },
    {
      title: 'Số lượng cần',
      dataIndex: 'required_quantity',
      key: 'required_quantity',
      width: 120,
      align: 'right',
      render: (value) => <Text strong>{value.toLocaleString()}</Text>,
    },
    {
      title: 'Tồn kho nguyên liệu',
      dataIndex: 'warehouse1_stock',
      key: 'warehouse1_stock',
      width: 120,
      align: 'right',
      render: (value) => <Text>{value.toLocaleString()}</Text>,
    },
    {
      title: 'Kho sản xuất',
      dataIndex: 'production_stock',
      key: 'production_stock',
      width: 120,
      align: 'right',
      render: (value) => (
        <Text type={value > 0 ? 'success' : 'secondary'}>
          {value.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Tổng tồn kho',
      dataIndex: 'total_stock',
      key: 'total_stock',
      width: 120,
      align: 'right',
      render: (value) => <Text>{value.toLocaleString()}</Text>,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 150,
      render: (_, record) => {
        const required = record.required_quantity;
        const inProduction = record.production_stock;
        const inTotal = record.total_stock;

        if (inProduction >= required) {
          return <Tag color={MANUFACTURING_ORDER_STATUS_COLORS.FINISHED}>Đủ (SX)</Tag>;
        } else if (inTotal >= required) {
          return <Tag color={MANUFACTURING_ORDER_STATUS_COLORS.ACTIVE}>Đủ (tổng), thiếu SX</Tag>;
        } else if (inTotal > 0) {
          return <Tag color={MANUFACTURING_ORDER_STATUS_COLORS.PENDING}>Thiếu {(required - inTotal).toLocaleString()}</Tag>;
        } else {
          return <Tag color={MANUFACTURING_ORDER_STATUS_COLORS.CANCELLED}>Chưa có</Tag>;
        }
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 4 }}>
          <Button
            type="primary"
            size="small"
            icon={<SwapOutlined />}
            onClick={() => handleAction(record, 'transfer')}
            disabled={record.warehouse1_stock <= 0}
          >
            Chuyển
          </Button>
          <Button
            type="default"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => handleAction(record, 'import')}
            style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', color: 'white' }}
          >
            Nhập
          </Button>
        </div>
      ),
    },
  ];

  const getModalTitle = () => {
    return actionType === 'transfer' 
      ? 'Chuyển nguyên vật liệu từ kho nguyên liệu sang kho sản xuất'
      : 'Nhập nguyên vật liệu vào kho nguyên liệu';
  };

  const getMaxQuantity = () => {
    return actionType === 'transfer' 
      ? selectedMaterial?.warehouse1_stock || 0
      : 999999; // Không giới hạn khi nhập kho
  };

  const getQuantityLabel = () => {
    return actionType === 'transfer' ? 'Số lượng chuyển:' : 'Số lượng nhập:';
  };

  return (
    <>
      {/* Chi tiết đơn hàng */}
      {workOrderData && (
        <Card 
          title="Chi tiết đơn hàng" 
          style={{ marginBottom: 16 }}
          size="small"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Text strong>Mã đơn hàng: </Text>
              <Text>{workOrderData.work_code}</Text>
            </Col>
            <Col span={8}>
              <Text strong>Số lượng sản xuất: </Text>
              <Text>{workOrderData.production_quantity?.toLocaleString()}</Text>
            </Col>
            <Col span={8}>
              <Text strong>Work Order ID: </Text>
              <Text>{workOrderData.work_id}</Text>
            </Col>
          </Row>
          {bomData && (
            <Row gutter={16} style={{ marginTop: 8 }}>
              <Col span={8}>
                <Text strong>BOM ID: </Text>
                <Text>{bomData.bom_id}</Text>
              </Col>
              <Col span={8}>
                <Text strong>Phiên bản BOM: </Text>
                <Text>{bomData.version}</Text>
              </Col>
              <Col span={8}>
                <Text strong>Sản phẩm ID: </Text>
                <Text>{bomData.product_id}</Text>
              </Col>
            </Row>
          )}
        </Card>
      )}

      {/* Bảng nguyên vật liệu */}
      <Table
        columns={columns}
        dataSource={processedData}
        rowKey="material_id"
        pagination={false}
        bordered
        size="middle"
        title={() => <Text strong>Nguyên vật liệu cần thiết</Text>}
        scroll={{ x: 1300 }}
      />

      {/* Modal chuyển kho / nhập kho */}
      <Modal
        title={getModalTitle()}
        open={importModal}
        onOk={handleConfirmAction}
        onCancel={() => setImportModal(false)}
        confirmLoading={loading}
        okText="Xác nhận"
        cancelText="Hủy"
        width={600}
      >
        {selectedMaterial && (
          <div style={{ padding: '16px 0' }}>
            {/* Thông tin nguyên vật liệu */}
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>Nguyên vật liệu:</strong> {selectedMaterial.material_name}</p>
                <p><strong>Đơn vị:</strong> {selectedMaterial.unit}</p>
                <p><strong>Số lượng/sản phẩm:</strong> {selectedMaterial.bom_quantity_per_unit.toLocaleString()}</p>
              </Col>
              <Col span={12}>
                <p><strong>Số lượng cần:</strong> {selectedMaterial.required_quantity.toLocaleString()}</p>
                <p><strong>Tồn kho WH1:</strong> {selectedMaterial.warehouse1_stock.toLocaleString()}</p>
                <p><strong>Kho sản xuất:</strong> {selectedMaterial.production_stock.toLocaleString()}</p>
              </Col>
            </Row>
            <p><strong>Tổng tồn kho:</strong> {selectedMaterial.total_stock.toLocaleString()}</p>

            {/* Thông tin chuyển kho/nhập kho */}
            {actionType === 'transfer' ? (
              <div style={{ backgroundColor: '#f6ffed', padding: 12, borderRadius: 6, marginTop: 12, border: '1px solid #b7eb8f' }}>
                <Text strong style={{ color: '#52c41a' }}>📦 Chuyển kho:</Text>
                <div style={{ marginTop: 4 }}>
                  <Text>Từ: <strong>Kho nguyên liệu (WH1)</strong></Text>
                  <br />
                  <Text>Đến: <strong>Kho sản xuất (WH2)</strong></Text>
                </div>
              </div>
            ) : (
              <div style={{ backgroundColor: '#e6f7ff', padding: 12, borderRadius: 6, marginTop: 12, border: '1px solid #91d5ff' }}>
                <Text strong style={{ color: '#1890ff' }}>📥 Nhập kho:</Text>
                <div style={{ marginTop: 4 }}>
                  <Text>Đến: <strong>Kho nguyên liệu (WH1)</strong></Text>
                </div>
              </div>
            )}

            {/* Input số lượng */}
            <div style={{ marginTop: 16 }}>
              <Text strong>{getQuantityLabel()}</Text>
              <InputNumber
                style={{ width: '100%', marginTop: 8 }}
                min={1}
                max={getMaxQuantity()}
                value={importQuantity}
                onChange={setImportQuantity}
                placeholder="Nhập số lượng"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {actionType === 'transfer' ? (
                  `Tối đa: ${getMaxQuantity().toLocaleString()} (tồn kho nguyên liệu)`
                ) : (
                  'Không giới hạn số lượng nhập'
                )}
              </Text>
            </div>

            {/* Gợi ý số lượng */}
            {actionType === 'transfer' && selectedMaterial.required_quantity > selectedMaterial.production_stock && (
              <div style={{ marginTop: 12, padding: 8, backgroundColor: '#fff7e6', borderRadius: 4, border: '1px solid #ffd591' }}>
                <Text type="warning" style={{ fontSize: 12 }}>
                  💡 Gợi ý: Cần chuyển thêm {(selectedMaterial.required_quantity - selectedMaterial.production_stock).toLocaleString()} để đủ sản xuất
                </Text>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default MaterialRequirementsTable;