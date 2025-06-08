import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Descriptions, Tag, Badge, Timeline, Spin, Row, Col, Typography, Button, message } from 'antd';
import { Modal } from 'antd';
import { getWorkOrderDetail, startWorkOrder, completeWorkOrder, getMaterialStatus } from '../../../api/manufacturing';
import MaterialRequirementsTable from './components/MaterialRequirementsTable';
import moment from 'moment';
const { Title } = Typography;


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
  const [materialLoading, setMaterialLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchDetail();
    fetchMaterialStatus();
  }, [id]);

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

  const fetchMaterialStatus = () => {
    setMaterialLoading(true);
    getMaterialStatus(id)
      .then(res => {
        console.log("🚀 Material status:", res.data.data.materials);
        setMaterialStatus(res.data.data || []);
      })
      .catch(err => {
        console.error('Error fetching material status:', err);
        setError('Không thể tải dữ liệu nguyên vật liệu');
      })
      .finally(() => setMaterialLoading(false));
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

  const handleComplete = () => {
    if (!workOrder) {
      message.error("Dữ liệu ca sản xuất chưa sẵn sàng");
      return;
    }

    console.log('handleComplete called');

    Modal.confirm({
      title: 'Xác nhận hoàn thành sản xuất?',
      content: 'Ca sản xuất sẽ được đánh dấu là hoàn thành.',
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      onOk() {
        console.log('onOk called');
        return new Promise((resolve, reject) => {
          executeComplete()
            .then(resolve)
            .catch(reject);
        });
      }
    });
  };



  const executeComplete = async () => {
    console.log('executeComplete called');

    try {
      setActionLoading(true);

      const completeData = {
        actual_end: new Date().toISOString(),
        completed_qty: workOrder.work_quantity,
        status: 'completed',
        notes: workOrder.notes || 'Hoàn thành sản xuất'
      };

      console.log('Sending data:', completeData);

      await completeWorkOrder(id, completeData);
      message.success('Hoàn thành sản xuất thành công');
      await fetchDetail();
      await fetchMaterialStatus();
    } catch (error) {
      console.error('Complete error:', error);
      message.error(error.response?.data?.message || 'Hoàn thành sản xuất thất bại');
      throw error; // để Modal.confirm xử lý reject
    } finally {
      setActionLoading(false);
    }
  };



  const handleMaterialRefresh = () => {
    fetchMaterialStatus();
  };

  // --- RENDER ---
  if (loading) return (
    <div style={{ width: '100%', padding: 50, textAlign: 'center' }}>
      <Spin size="large" />
      <div style={{ marginTop: 16 }}>Đang tải dữ liệu...</div>
    </div>
  );

  if (error) return <div style={{ color: 'red', padding: 20 }}>{error}</div>;

  if (!workOrder) return <div>Không có dữ liệu Work Order</div>;

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
            variant="outlined"
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
                  <Button loading={actionLoading} disabled>
                    Đã hoàn thành
                  </Button>
                )}
              </>
            }
          >

            <Descriptions column={2} variant="bordered" size="middle">
              <Descriptions.Item label="Tên đơn sản xuất">{workOrder.ManufacturingOrder?.order_number || '—'}</Descriptions.Item>
              <Descriptions.Item label="Mã ca sản xuất">{workOrder.work_code || '—'}</Descriptions.Item>
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
              <Descriptions.Item label="Mô tả">{workOrder.description || '—'}</Descriptions.Item>
              <Descriptions.Item label="Ghi chú">{workOrder.notes || '—'}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Quy trình & Trạng thái" variant="outlined">
            <Timeline
              mode="left"
              items={[
                {
                  color: statusColors[workOrder.status] || 'blue',
                  children: (
                    <>
                      <b>{statusLabels[workOrder.status] || workOrder.status}</b> - {formatDate(workOrder.actual_start)}
                    </>
                  )
                }
              ]}
            />
          </Card>
        </Col>

        {/* Bảng nguyên vật liệu */}
        <Col xs={24}>
          <Card
            title="Nguyên vật liệu cần thiết"
            style={{ marginTop: 24 }}
            loading={materialLoading}
            extra={
              <Button onClick={handleMaterialRefresh} size="small">
                Làm mới
              </Button>
            }
          >
            {materialStatus && materialStatus.materials ? (
              <MaterialRequirementsTable
                materialData={materialStatus.materials}
                workOrderData={materialStatus.workOrder}
                bomData={materialStatus.bom}
                workOrderId={id}
                onRefresh={handleMaterialRefresh}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: 40 }}>
                Không có dữ liệu nguyên vật liệu
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24}>
          <Card title="Thông tin đơn sản xuất" style={{ marginTop: 24 }}>
            <Descriptions column={2} variant="bordered" size="small">
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

      </Row>
    </div>
  );
}