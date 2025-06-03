import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Descriptions, Tag, Table, Badge, Timeline, Spin, Row, Col, Typography, Button, Modal, message } from 'antd';
import { getWorkOrderDetail, startWorkOrder, completeWorkOrder, getMaterialStatus } from '../../api/manufacturing';
import moment from 'moment';

const { Title } = Typography;
const { confirm } = Modal;

const statusLabels = {
  pending: 'Chờ thực hiện',
  in_progress: 'Đang thực hiện',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
  paused: 'Tạm dừng'
};

const statusColors = {
  pending: 'blue',
  in_progress: 'cyan',
  completed: 'green',
  cancelled: 'red',
  paused: 'orange'
};

const priorityColors = {
  high: 'red',
  medium: 'orange',
  low: 'green',
};

const priorityLabels = {
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
};

export default function ManufacturingWorkOrderDetailPage() {
  const { id } = useParams();
  const [workOrder, setWorkOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [materialStatus, setMaterialStatus] = useState(null);



  useEffect(() => {
    if (!id) return;
    fetchDetail();
    fetchMaterialStatus();
  }, [id]);

  const materialRequirementsColumns = [
    {
      title: 'Work ID',
      dataIndex: 'work_id',
      key: 'work_id',
    },
    {
      title: 'Material ID',
      dataIndex: 'material_id',
      key: 'material_id',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (val) => Number(val).toLocaleString(),
    },
  ];

  const bomItemsColumns = [
    {
      title: 'Item ID',
      dataIndex: 'item_id',
      key: 'item_id',
    },
    {
      title: 'Material ID',
      dataIndex: 'material_id',
      key: 'material_id',
    },
    {
      title: 'Material Name',
      dataIndex: 'material_name',
      key: 'material_name',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (val) => parseFloat(val).toFixed(2),
    },
  ];


  const fetchDetail = () => {
    setLoading(true);
    getWorkOrderDetail(id)
      .then(res => {
        console.log("🚀 res.data", res.data);
        setWorkOrder(res.data.data);
        setError(null);
      })
      .catch(() => setError('Không thể tải dữ liệu'))
      .finally(() => setLoading(false));
  };
  const formatDate = (date) => date ? moment(date).format('DD/MM/YYYY HH:mm') : '';

  const handleStart = () => {
    setActionLoading(true);
    startWorkOrder(id)
      .then(() => {
        message.success('Bắt đầu sản xuất thành công');
        fetchDetail();
      })
      .catch(() => message.error('Bắt đầu sản xuất thất bại'))
      .finally(() => setActionLoading(false));
  };


  const fetchMaterialStatus = () => {
    getMaterialStatus(id)
      .then(res => {
        console.log("🚀 res.data1", res.data.bom);
        setMaterialStatus(res.data.data)
      })
      .catch(() => setError('Không thể tải dữ liệu'));
  };

  const handleComplete = () => {
    confirm({
      title: 'Xác nhận hoàn thành sản xuất?',
      onOk() {
        setActionLoading(true);
        return completeWorkOrder(id)
          .then(() => {
            message.success('Hoàn thành sản xuất thành công');
            fetchDetail();
          })
          .catch(() => message.error('Hoàn thành sản xuất thất bại'))
          .finally(() => setActionLoading(false));
      }
    });
  };

  // --- RENDER ---
  // Nếu đang loading, show spinner, lỗi show lỗi, không có data show trống
  if (loading) return <Spin spinning={true} tip="Đang tải dữ liệu..." style={{ width: '100%', padding: 50 }} />;

  if (error) return <div style={{ color: 'red', padding: 20 }}>{error}</div>;

  if (!workOrder) return <div>Không có dữ liệu Work Order</div>;

  // Đảm bảo workOrder khác null đến đây

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Link to="/manufacturing/work-orders">← Quay lại danh sách Work Orders</Link>
        </Col>
        <Col xs={24}>
          <Title level={2}>Chi tiết Ca sản xuất</Title>
        </Col>

        <Col xs={24} md={16}>
          <Card
            bordered
            style={{ marginBottom: 24 }}
            extra={
              <>
                {workOrder.status === 'pending' && (
                  <Button
                    type="primary"
                    loading={actionLoading}
                    onClick={handleStart}
                    style={{ marginRight: 8 }}
                  >
                    Bắt đầu sản xuất
                  </Button>
                )}
                {workOrder.status === 'in_progress' && (
                  <Button loading={actionLoading} onClick={handleComplete}>
                    Hoàn thành sản xuất
                  </Button>
                )}
                {workOrder.status === 'completed' && (
                  <Button loading={actionLoading} >
                    Đã hoàn thành
                  </Button>
                )}
              </>
            }
          >
            <Descriptions column={2} bordered size="middle">
              <Descriptions.Item label="Mã Work Order">{workOrder.work_code || '—'}</Descriptions.Item>
              <Descriptions.Item label="ID sản phẩm">{workOrder.item_id || '—'}</Descriptions.Item>
              <Descriptions.Item label="Tên sản phẩm">{workOrder.item_name || '—'}</Descriptions.Item>
              <Descriptions.Item label="Đơn vị sản phẩm">{workOrder.ManufacturingOrderDetail?.itemInfo?.unit || '—'}</Descriptions.Item>
              <Descriptions.Item label="Số lượng cần sản xuất">{workOrder.work_quantity || 0}</Descriptions.Item>
              <Descriptions.Item label="Bước quy trình">
                <Badge color="blue" text={workOrder.process_step || '—'} />
              </Descriptions.Item>
              <Descriptions.Item label="Loại công đoạn">{workOrder.operation_type || '—'}</Descriptions.Item>
              <Descriptions.Item label="Đã hoàn thành">{workOrder.completed_qty || 0}</Descriptions.Item>
              <Descriptions.Item label="Bộ phận">{workOrder.department || '—'}</Descriptions.Item>
              <Descriptions.Item label="Độ ưu tiên">
                <Tag color={priorityColors[workOrder.priority] || 'default'}>
                  {priorityLabels[workOrder.priority] || workOrder.priority || '—'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={statusColors[workOrder.status] || 'default'}>
                  {statusLabels[workOrder.status] || workOrder.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu dự kiến">{formatDate(workOrder.planned_start)}</Descriptions.Item>
              <Descriptions.Item label="Ngày kết thúc dự kiến">{formatDate(workOrder.planned_end)}</Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu thực tế">{formatDate(workOrder.actual_start)}</Descriptions.Item>
              <Descriptions.Item label="Ngày kết thúc thực tế">{formatDate(workOrder.actual_end)}</Descriptions.Item>
              <Descriptions.Item label="Người phụ trách">{workOrder.AssignedUser?.username || '—'}</Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>{workOrder.description || '—'}</Descriptions.Item>
              <Descriptions.Item label="Ghi chú" span={2}>{workOrder.notes || '—'}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Quy trình & Trạng thái" bordered>
            <Timeline mode="left">
              <Timeline.Item color={statusColors[workOrder.status] || 'blue'}>
                <b>{statusLabels[workOrder.status] || workOrder.status}</b> - {formatDate(workOrder.actual_start)}
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>

        <Row gutter={30}>
          <Col xs={24}>
            <Card style={{ marginTop: 0 }}>
              <Table
                title={() => <b>BOM</b>}
                rowKey="item_id"
                columns={bomItemsColumns}
                dataSource={materialStatus?.bom ?? []}
                pagination={false}
                bordered
                size="small"
              />
            </Card>
          </Col>
          <Col xs={24}>
            <Card style={{ marginTop: 0 }}>
              <Table
                title={() => <b>Yêu cầu vật tư</b>}
                rowKey="item_id"
                columns={materialRequirementsColumns}
                dataSource={materialStatus?.materialRequirements ?? []}
                pagination={false}
                bordered
                size="small"
              />
            </Card>
          </Col>
        </Row>



        <Col xs={24}>
          <Card title="Thông tin đơn sản xuất" style={{ marginTop: 24 }}>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Số đơn">{workOrder.ManufacturingOrder?.order_number || '—'}</Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">{formatDate(workOrder.ManufacturingOrder?.start_date)}</Descriptions.Item>
              <Descriptions.Item label="Ngày kết thúc">{formatDate(workOrder.ManufacturingOrder?.end_date)}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={statusColors[workOrder.ManufacturingOrder?.status] || 'default'}>
                  {statusLabels[workOrder.ManufacturingOrder?.status] || workOrder.ManufacturingOrder?.status || '—'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24}>
          <Card title="Chi tiết đơn hàng" style={{ marginTop: 24 }}>
            {Array.isArray(workOrder.ManufacturingOrderDetail) && workOrder.ManufacturingOrderDetail.length > 0 ? (
              <Descriptions column={2} bordered size="small">
                {workOrder.ManufacturingOrderDetail.map((detail, idx) => (
                  <React.Fragment key={idx}>
                    <Descriptions.Item label="Quy cách">{detail.specification || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Số lượng">{detail.quantity || 0}</Descriptions.Item>
                    <Descriptions.Item label="Đã SX">{detail.produced_qty || 0}</Descriptions.Item>
                    <Descriptions.Item label="Ưu tiên">
                      <Tag color={priorityColors[detail.priority] || 'default'}>
                        {priorityLabels[detail.priority] || detail.priority || '—'}
                      </Tag>
                    </Descriptions.Item>
                  </React.Fragment>
                ))}
              </Descriptions>
            ) : (
              <div>Không có chi tiết đơn hàng</div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
