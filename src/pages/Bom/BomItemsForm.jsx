import { Form, Input, InputNumber, Select, Button } from 'antd';
import { useEffect, useState } from 'react';
import { getMaterials, getSemiProducts } from '@/api/materials';
const { Option } = Select;

export default function BOMItemForm({ form, onSubmit, initialValues = {} }) {
  const [itemType, setItemType] = useState(initialValues.item_type || 'material');
  const [referenceOptions, setReferenceOptions] = useState([]);


  // Tải dữ liệu tương ứng với loại
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = itemType === 'material'
          ? await getMaterials()
          : await getSemiProducts();
        const items = itemType === 'material' ? res.data.materials : res.data.semi_products;
        setReferenceOptions(Array.isArray(items) ? items : []);
        console.log('Fetched items:', items);
      } catch (err) {
        console.error(err);
      }
    };

    if (itemType) fetchData();
  }, [itemType]);


  return (
    <Form form={form} layout="vertical" onFinish={onSubmit} initialValues={initialValues}>
      <Form.Item label="Loại item" name="item_type" rules={[{ required: true }]}>
        <Select onChange={val => setItemType(val)}>
          <Option value="material">Nguyên vật liệu</Option>
          <Option value="semi_product">Bán thành phẩm</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Mã item" name="reference_id" rules={[{ required: true }]}>
        <Select onChange={(val) => form.setFieldsValue({ reference_id: val })}>
          {referenceOptions.map(item => (
            <Option key={item.material_id || item.semi_product_id} value={item.material_id || item.semi_product_id}>
              {item.code} — {item.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Cấp BOM" name="bom_level" rules={[{ required: true }]}>
        <InputNumber min={1} />
      </Form.Item>

      <Form.Item label="Mã tham chiếu" name="reference">
        <Input />
      </Form.Item>

      <Form.Item label="Số lượng" name="quantity" rules={[{ required: true }]}>
        <InputNumber min={1} step={1} />
      </Form.Item>

      <Form.Item label="% hao hụt" name="waste_percent">
        <InputNumber min={0} max={100} step={0.1} />
      </Form.Item>

      <Form.Item label="Ghi chú" name="notes">
        <Input.TextArea rows={3} />
      </Form.Item>

    </Form>
  );
}
