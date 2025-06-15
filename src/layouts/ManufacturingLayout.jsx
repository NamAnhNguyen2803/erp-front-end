import React from 'react';
import { Table, Button, Input, Select, Breadcrumb, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const ManufacturingLayout = ({
  title = 'Product Management',
  breadcrumb = ['Dashboard', 'Products'],
  searchPlaceholder = 'Search',
  showAddButton = true,
  onAddClick,
  columns,
  data,
  filters = [],
  pagination = { pageSize: 10 },
  onRow,
}) => {
  return (
    <div style={{  background: '#fff', borderRadius: 8 }}>
      {/* Breadcrumb + Title + Add Button */}
      <div style={{ marginBottom: 16 }}>
        <Breadcrumb style={{ marginBottom: 8 }}>
          {breadcrumb.map((item, index) => (
            <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
          ))}
        </Breadcrumb>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>{title}</h1>
          {showAddButton && (
            <Button type="primary" icon={<PlusOutlined />} onClick={onAddClick}>
              Thêm
            </Button>
          )}
        </div>
      </div>

      {/* Search + Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder={searchPlaceholder}
          style={{ maxWidth: 300 }}
        />
        <Space wrap>
          {filters.map((filter, i) => (
            <Select
              key={i}
              defaultValue={filter.defaultValue}
              style={{ width: 160 }}
              onChange={filter.onChange}
            >
              {filter.options.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          ))}
        </Space>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ position: ['bottomCenter'], ...pagination }}
        rowKey="id"
        onRow={onRow}
      />
    </div>
  );
};

export default ManufacturingLayout;
