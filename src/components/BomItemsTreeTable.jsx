import React from 'react';
import { Table } from 'antd';
import { STATUS, STATUS_LABELS } from '../constants/supplyType.enum.ts';
import { itemTypeMap } from '../constants/transactionType.enum.ts';
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
    { title: 'Mã thành phần', dataIndex: 'code', key: 'code' },
    { title: 'Tên thành phần', dataIndex: 'name', key: 'name' },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Đơn vị', dataIndex: 'unit', key: 'unit' },
    {
      title: 'Loại thành phần',
      dataIndex: 'item_type',
      render: 
      (item_type) => itemTypeMap[item_type],

      key: 'item_type',
    },
  ];

  return <Table columns={columns} dataSource={data} pagination={false} />;
};

export default BomItemsTreeTable;