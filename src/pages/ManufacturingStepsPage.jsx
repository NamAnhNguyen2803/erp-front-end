import React from 'react';
import { Table, Button, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const ManufacturingStepsPage = () => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên công đoạn',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />}>Sửa</Button>
          <Button danger icon={<DeleteOutlined />}>Xóa</Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      id: '1',
      name: 'Công đoạn 1',
      description: 'Mô tả công đoạn 1',
      status: 'Đang thực hiện',
    },
    {
      key: '2',
      id: '2',
      name: 'Công đoạn 2',
      description: 'Mô tả công đoạn 2',
      status: 'Hoàn thành',
    },
  ];

  return (
    <div>
      <h1>Công đoạn làm việc</h1>
      <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
        Thêm công đoạn
      </Button>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default ManufacturingStepsPage; 