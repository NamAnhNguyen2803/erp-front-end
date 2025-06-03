import React from 'react';
import { Table } from 'antd';

const ReportsProductionPage = () => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên báo cáo',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  const data = [
    {
      key: '1',
      id: '1',
      name: 'Báo cáo 1',
      createdDate: '2023-01-01',
      status: 'Hoàn thành',
    },
    {
      key: '2',
      id: '2',
      name: 'Báo cáo 2',
      createdDate: '2023-02-01',
      status: 'Đang thực hiện',
    },
  ];

  return (
    <div>
      <h1>Báo cáo sản xuất</h1>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default ReportsProductionPage; 