import React, { useEffect, useState } from 'react';
import { Table, message } from 'antd';
import { getBomById } from '../api/bomApi';

const BomItemsTable = ({ bomId }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getBomById(bomId);
        setItems(data.items);
      } catch (e) {
        message.error('Lỗi tải item của BOM');
      }
    };
    fetchDetails();
  }, [bomId]);

  const columns = [
    {
      title: 'Mã',
      dataIndex: ['material_details', 'code'],
    },
    {
      title: 'Tên',
      dataIndex: ['material_details', 'name'],
    },
    {
      title: 'Loại',
      dataIndex: 'item_type',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Đơn vị',
      dataIndex: ['material_details', 'unit'],
    },
    {
      title: '% Hao hụt',
      dataIndex: 'waste_percent',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={items}
      size="small"
      pagination={false}
      rowKey={(record, index) => index}
    />
  );
};

export default BomItemsTable;
