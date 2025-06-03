import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  message,
} from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;


const warehouseOptions = [
  { label: 'Warehouse 1000', value: 1000 },
  { label: 'Warehouse 2000', value: 2000 },
  { label: 'Warehouse 3000', value: 3000 },
];

const itemTypeOptions = [
  { label: 'Material', value: 'material' },
  { label: 'Semi Product', value: 'semi_product' },
  { label: 'Product', value: 'product' },
];

const referenceTypeOptions = [
  { label: 'PO', value: 'po' },
  { label: 'DO', value: 'do' },
  { label: 'SO', value: 'so' },
];

const baseURL = 'http://localhost:3030';
const transactionTypeEndpoints = {
  import: `${baseURL}/api/v1/transactions/import`,
  export: `${baseURL}/api/v1/transactions/export`,
  transfer: `${baseURL}/api/v1/transactions/transfer`,
};
interface InventoryTransactionFormProps {
  onSuccess?: () => void;
}
const InventoryTransactionForm: React.FC<InventoryTransactionFormProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [transactionType, setTransactionType] = useState<'import' | 'export' | 'transfer'>('import');

  const handleSubmit = async (values: any) => {
    const payload = {
      item_type: values.item_type,
      item_id: parseInt(values.item_id, 10),
      quantity: parseFloat(values.quantity),
      from_warehouse_id: values.from_warehouse_id/1000 || null,
      to_warehouse_id: values.to_warehouse_id/1000 || null,
      transaction_date: values.transaction_date?.format?.('YYYY-MM-DD') ?? values.transaction_date,
      reference_id: values.reference_id || null,
      reference_type: values.reference_type || null,
      description: values.description || null,
      unit: values.unit || null
    };

    try {
      const endpoint = transactionTypeEndpoints[transactionType];
      console.log(payload)
      await axios.post(endpoint, payload);
      message.success('Transaction saved successfully');
      form.resetFields();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      message.error('Failed to save transaction');
    }
  };

  const showFromWarehouse = transactionType !== 'import';
  const showToWarehouse = transactionType !== 'export';
  console.log(baseURL)
  return (
    
    <div className="px-6 py-8 bg-[#131612] text-white max-w-[600px] w-full mx-auto rounded-xl">
      <h2 className="text-3xl font-bold mb-6">Inventory Transaction</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="text-white"
      >
        <Form.Item
          label="Transaction Type"
          name="transaction_type"
          rules={[{ required: true, message: 'Please select transaction type' }]}
        >
          <Select
            placeholder="Select Transaction Type"
            onChange={value => setTransactionType(value)}
            className="bg-[#1f241e] text-white border-[#434f40]"
          >
            <Option value="import">Stock In</Option>
            <Option value="export">Stock Out</Option>
            <Option value="transfer">Transfer</Option>
          </Select>
        </Form.Item>

        {showFromWarehouse && (
          <Form.Item
            label="From Warehouse"
            name="from_warehouse_id"
            rules={[...(transactionType === 'transfer' ? [{ required: true, message: 'Required' }] : [])]}
          >
            <Select
              placeholder="Select Warehouse"
              className="bg-[#1f241e] text-white border-[#434f40]"
              options={warehouseOptions}
            />
          </Form.Item>
        )}

        {showToWarehouse && (
          <Form.Item
            label="To Warehouse"
            name="to_warehouse_id"
            rules={[...(transactionType === 'transfer' ? [{ required: true, message: 'Required' }] : [])]}
          >
            <Select
              placeholder="Select Warehouse"
              className="bg-[#1f241e] text-white border-[#434f40]"
              options={warehouseOptions}
            />
          </Form.Item>
        )}

        <Form.Item
          label="Item ID"
          name="item_id"
          rules={[{ required: true, message: 'Enter item ID' }]}
        >
          <Input
            placeholder="Enter Item ID"
            className="bg-[#1f241e] text-white border-[#434f40]"
          />
        </Form.Item>

        <Form.Item
          label="Item Type"
          name="item_type"
          rules={[{ required: true, message: 'Select item type' }]}
        >
          <Select
            placeholder="Select Item Type"
            className="bg-[#1f241e] text-white border-[#434f40]"
            options={itemTypeOptions}
          />
        </Form.Item>

        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true, message: 'Enter quantity' }]}
        >
          <Input
            type="number"
            placeholder="Enter Quantity"
            className="bg-[#1f241e] text-white border-[#434f40]"
          />
        </Form.Item>

        {/* <Form.Item
          label="Unit"
          name="unit"
          rules={[{ required: true, message: 'Enter unit' }]}
        >
          <Input
            placeholder="Enter Unit"
            className="bg-[#1f241e] text-white border-[#434f40]"
          />
        </Form.Item> */}

        <Form.Item
          label="Transaction Date"
          name="transaction_date"
          rules={[{ required: true, message: 'Select date' }]}
        >
          <DatePicker
            className="w-full bg-[#1f241e] text-white border-[#434f40]"
          />
        </Form.Item>

        <Form.Item
          label="Reference ID"
          name="reference_id"
        >
          <Input
            placeholder="Enter Reference ID"
            className="bg-[#1f241e] text-white border-[#434f40]"
          />
        </Form.Item>

        <Form.Item
          label="Reference Type"
          name="reference_type"
        >
          <Select
            placeholder="Select Reference Type"
            className="bg-[#1f241e] text-white border-[#434f40]"
            options={referenceTypeOptions}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          <TextArea
            rows={4}
            placeholder="Enter Description"
            className="bg-[#1f241e] text-white border-[#434f40]"
          />
        </Form.Item>

        <Form.Item className="flex justify-end gap-3 mt-6">
          <Button
            onClick={() => form.resetFields()}
            className="bg-[#2e352c] text-white"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-[#8cd279] text-[#131612]"
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InventoryTransactionForm;
