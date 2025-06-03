import React from 'react';
import { Layout, Menu } from 'antd';
import { DashboardOutlined,  InboxOutlined, ToolOutlined, FileTextOutlined, TeamOutlined, BarChartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

const AppSidebar = () => {
  return (
    <Sider width={250} style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <Menu mode="inline" defaultSelectedKeys={['dashboard']} style={{ height: '100%', borderRight: 0 }}>
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.SubMenu key="manufacturing"  title="Sản xuất">
          <Menu.Item key="plans"><Link to="/manufacturing/plans">Kế hoạch sản xuất</Link></Menu.Item>
          <Menu.Item key="orders"><Link to="/manufacturing/orders">Lệnh sản xuất</Link></Menu.Item>
          <Menu.Item key="steps"><Link to="/manufacturing/steps">Công đoạn làm việc</Link></Menu.Item>
          <Menu.Item key="work-orders"><Link to="/manufacturing/work-orders">Trạm làm việc</Link></Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="inventory" icon={<InboxOutlined />} title="Kho hàng">
          <Menu.Item key="warehouses"><Link to="/inventory/warehouses">Kho hàng</Link></Menu.Item>
          <Menu.Item key="stock"><Link to="/inventory/stock">Tồn kho</Link></Menu.Item>
          <Menu.Item key="transactions"><Link to="/inventory/transactions">Nhập/Xuất kho</Link></Menu.Item>
          <Menu.Item key="history"><Link to="/inventory/history">Lịch sử giao dịch</Link></Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="products" icon={<ToolOutlined />} title="Sản phẩm">
          <Menu.Item key="finished"><Link to="/products/finished">Thành phẩm</Link></Menu.Item>
          <Menu.Item key="semi"><Link to="/products/semi">Bán thành phẩm</Link></Menu.Item>
          <Menu.Item key="materials"><Link to="/products/materials">Nguyên liệu</Link></Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="boms" icon={<FileTextOutlined />} title="BOM">
          <Menu.Item key="product-boms"><Link to="/boms/products">BOM thành phẩm</Link></Menu.Item>
          <Menu.Item key="semi-boms"><Link to="/boms/semi-products">BOM bán thành phẩm</Link></Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key="users" icon={<TeamOutlined />}>
          <Link to="/users">Người dùng</Link>
        </Menu.Item>
        <Menu.Item key="reports" icon={<BarChartOutlined />}>
          <Link to="/reports">Báo cáo</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default AppSidebar; 