import React from 'react';
import { Table, Button, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const UsersPage = () => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
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
      name: 'Người dùng 1',
      email: 'user1@example.com',
      role: 'Admin',
    },
    {
      key: '2',
      id: '2',
      name: 'Người dùng 2',
      email: 'user2@example.com',
      role: 'User',
    },
  ];

  return (
    <div>
      <h1>Người dùng</h1>
      <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
        Thêm người dùng
      </Button>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default UsersPage; 