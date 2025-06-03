import React from 'react';
import { Table } from 'antd';

const BomItemsTreeTable = ({ items }) => {
  const data = items.map((item, index) => ({
    key: index,
    name: item.material_details?.name || 'N/A',
    code: item.material_details?.code,
    quantity: item.quantity,
    unit: item.material_details?.unit,
    item_type: item.item_type,
  }));

  const columns = [
    { title: 'Mã', dataIndex: 'code', key: 'code' },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Đơn vị', dataIndex: 'unit', key: 'unit' },
    { title: 'Loại', dataIndex: 'item_type', key: 'item_type' },
  ];

  return <Table columns={columns} dataSource={data} pagination={false} />;
};

export default BomItemsTreeTable;
