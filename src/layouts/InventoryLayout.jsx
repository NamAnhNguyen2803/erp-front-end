import React from 'react';
import { Table, Input, Button, Pagination, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const InventoryTableLayout = ({
  title,
  columns,
  dataSource,
  currentPage,
  total, // Thêm prop total
  pageSize, // Thêm prop pageSize
  onPageChange, // Prop để xử lý thay đổi trang
  onPageSizeChange, // Thêm prop để xử lý thay đổi pageSize
  searchText,
  onSearchChange,
  extraFilters,
  actions,
}) => {
  return (
    <div className="px-10 py-5">
      <div className="max-w-[960px] mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <h1 className="text-[#111418] text-[32px] font-bold leading-tight min-w-72">
            {title}
          </h1>
          <div className="flex gap-2">{actions}</div>
        </div>

        {/* Filters */}
        {extraFilters && (
          <div className="flex gap-3 p-3 flex-wrap pr-4">{extraFilters}</div>
        )}

        {/* Search */}
        <div className="px-4 py-3">
          <Input
            placeholder="Tìm kiếm theo mã hoặc tên sản phẩm"
            prefix={<SearchOutlined className="text-[#60758a]" />}
            className="h-12 w-full bg-[#f0f2f5] border-none rounded-lg"
            value={searchText}
            onChange={onSearchChange}
          />
        </div>

        {/* Table */}
        <div className="px-4 py-3">
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            className="rounded-lg border border-[#dbe0e6]"
          />
        </div>

        {/* Pagination and Page Size Selector */}
        <div className="flex justify-end items-center gap-4 px-4 py-3">
          <Select
            value={pageSize}
            onChange={onPageSizeChange}
            style={{ width: 120 }}
            size="middle"
          >
            <Option value={10}>10 / trang</Option>
            <Option value={20}>20 / trang</Option>
            <Option value={50}>50 / trang</Option>
          </Select>
          <Pagination
            current={currentPage}
            total={total}
            pageSize={pageSize}
            onChange={onPageChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryTableLayout;