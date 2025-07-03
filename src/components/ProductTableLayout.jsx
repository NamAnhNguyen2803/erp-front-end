import React from 'react';
import { Table, Button, Input, Select, Tag, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { STATUS, STATUS_LABELS } from '../constants/supplyType.enum';
const { Option } = Select;

const ProductTableLayout = ({
  title = 'Product Management',
  searchPlaceholder = 'Search',
  showAddButton = true,
  onAddClick,
  columns,
  data,
  onRow ,
  filters = [],
  pagination = { pageSize: 10 },
}) => {
  return (
    <div style={{ padding: 12, border: '4px' }}>
      {/* Header + Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ marginBottom: 0, marginTop: 0 }}>{title}</h1>
        </div>
        {showAddButton && (
          <Button icon={<PlusOutlined />} onClick={onAddClick}>
            Thêm
          </Button>
        )}
      </div>

      {/* Search + Filter */}
      <Input
        prefix={<SearchOutlined />}
        placeholder={searchPlaceholder}
        style={{ marginBottom: 16, maxWidth: 300 }}
      />

      <Space style={{ marginBottom: 16 }}>
        {filters.map((filter, i) => (
          <Select key={i} defaultValue={filter.defaultValue} style={{ width: 150 }} onChange={filter.onChange}>
            {filter.options.map((opt) => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
        ))}
      </Space>

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

export default ProductTableLayout;
