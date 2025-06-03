import { Form, Input, Select, DatePicker, Button } from 'antd';
import dayjs from 'dayjs';

export default function WorkOrderForm({
    onSubmit,
    orderId, // <-- từ MODetailPage
    orderDetails = [], // <-- danh sách detail cho dropdown
    initialValues = {}
}) {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        const payload = {
            ...values,
            order_id: orderId,
            planned_start: values.planned_start?.toISOString(),
            planned_end: values.planned_end?.toISOString(),
        };
        onSubmit(payload);
    };
    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{
                priority: 'Medium',
                ...initialValues,
                planned_start: initialValues?.planned_start ? dayjs(initialValues.planned_start) : null,
                planned_end: initialValues?.planned_end ? dayjs(initialValues.planned_end) : null,
            }}
        >
            {/* Ẩn order_id */}
            <Form.Item name="order_id" initialValue={orderId} hidden>
                <Input />
            </Form.Item>
            <Form.Item label="Mã Work Order" name="work_code" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="order_detail_id" label="Mã sản phẩm" rules={[{ required: true }]}>
                <Select placeholder="Mã sản phẩm">
                    {orderDetails.map((detail) => (
                        <Select.Option key={detail.detail_id} value={detail.detail_id}>
                            {detail.item_info?.code ? `${detail.item_info.code} - ` : ''}{detail.item_info?.name || detail.item_name || `Detail #${detail.detail_id}`}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>


            <Form.Item label="Process Step" name="process_step" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item label="Operation Type" name="operation_type" rules={[{ required: true }]}>
                <Select>
                    <Select.Option value="Manual">Manual</Select.Option>
                    <Select.Option value="Automatic">Automatic</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item label="Work Quantity" name="work_quantity" rules={[{ required: true }]}>
                <Input type="number" min={1} />
            </Form.Item>

            <Form.Item label="Assigned To" name="assigned_to" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item label="Department" name="department">
                <Input />
            </Form.Item>

            <Form.Item label="Priority" name="priority">
                <Select>
                    <Select.Option value="Low">Low</Select.Option>
                    <Select.Option value="Medium">Medium</Select.Option>
                    <Select.Option value="High">High</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item label="Planned Start" name="planned_start">
                <DatePicker showTime />
            </Form.Item>

            <Form.Item label="Planned End" name="planned_end">
                <DatePicker showTime />
            </Form.Item>

            <Form.Item label="Description" name="description">
                <Input.TextArea />
            </Form.Item>

            <Form.Item label="Notes" name="notes">
                <Input.TextArea />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Tạo Work Order
                </Button>
            </Form.Item>
        </Form>
    );
}
