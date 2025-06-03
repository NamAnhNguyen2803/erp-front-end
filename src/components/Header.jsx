import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Dropdown, Menu, Layout, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Text } = Typography;

const HeaderComponent = () => {
  const location = useLocation();

  // Tạo menu chuẩn antd 5, dùng items thay vì array objects tự định nghĩa
  const productMenuItems = [
    { key: "/products/finished", label: <Link to="/products/finished">Sản phẩm hoàn chỉnh</Link> },
    { key: "/products/semi", label: <Link to="/products/semi">Sản phẩm bán thành phẩm</Link> },
    { key: "/products/materials", label: <Link to="/products/materials">Nguyên vật liệu</Link> },
  ];


  const bomMenuItems = [
    { key: "/boms/products", label: <Link to="/boms/products">BOM sản phẩm</Link> },
    { key: "/boms/semi-products", label: <Link to="/boms/semi-products">BOM bán thành phẩm</Link> },
  ];

  const manufacturingMenuItems = [
    { key: "/manufacturing/plans", label: <Link to="/manufacturing/plans">Kế hoạch sản xuất</Link> },
    { key: "/manufacturing/orders", label: <Link to="/manufacturing/orders">Lệnh sản xuất</Link> },
    { key: "/manufacturing/steps", label: <Link to="/manufacturing/steps">Bước sản xuất</Link> },
    { key: "/manufacturing/work-orders", label: <Link to="/manufacturing/work-orders">Ca sản xuất</Link> },
  ];

  const inventoryMenuItems = [
    { key: "/inventory/stock", label: <Link to="/inventory/stock">Tồn kho</Link> },
    { key: "/inventory/transactions", label: <Link to="/inventory/transactions">Giao dịch</Link> },
    { key: "/inventory/warehouses", label: <Link to="/inventory/warehouses">Kho hàng</Link> },
    { key: "/inventory/history", label: <Link to="/inventory/history">Lịch sử</Link> },
  ];

  const costMenuItems = [
    { key: "/costs/material", label: <Link to="/costs/material">Chi phí NVL</Link> },
    { key: "/costs/manufacturing", label: <Link to="/costs/manufacturing">Chi phí sản xuất</Link> },
  ];

  // Helper để highlight dropdown khi route bắt đầu đúng với key menu
  const isActiveMenu = (keys) => keys.some(key => location.pathname.startsWith(key));

  return (
    <Header className="header" style={{ background: "#fff", padding: "0 24px" }}>
      <div style={{ display: "flex", gap: "32px", alignItems: "center", height: "64px" }}>
        <Link to="/" style={{ fontWeight: location.pathname === "/" ? "700" : "500", color: "#000" }}>
          Trang chủ
        </Link>

        {/* <Dropdown
          menu={{ items: productMenuItems }}
          trigger={['click']}
          placement="bottom"
        >
          <Text
            style={{
              cursor: "pointer",
              fontWeight: isActiveMenu(productMenuItems.map(i => i.key)) ? "700" : "500",
              color: "#000"
            }}
          >
            Sản phẩm <DownOutlined />
          </Text>
        </Dropdown> */}

        <Link to="/material" style={{ fontWeight: location.pathname === "/material" ? "700" : "500", color: "#000" }}>
          Vật tư
        </Link>

        <Dropdown menu={{ items: bomMenuItems }} trigger={['click']} placement="bottom">
          <Text
            style={{
              cursor: "pointer",
              fontWeight: isActiveMenu(bomMenuItems.map(i => i.key)) ? "700" : "500",
              color: "#000"
            }}
          >
            BOM <DownOutlined />
          </Text>
        </Dropdown>

        <Dropdown menu={{ items: manufacturingMenuItems }} trigger={['click']} placement="bottom">
          <Text
            style={{
              cursor: "pointer",
              fontWeight: isActiveMenu(manufacturingMenuItems.map(i => i.key)) ? "700" : "500",
              color: "#000"
            }}
          >
            Sản xuất <DownOutlined />
          </Text>
        </Dropdown>

        <Dropdown menu={{ items: inventoryMenuItems }} trigger={['click']} placement="bottom">
          <Text
            style={{
              cursor: "pointer",
              fontWeight: isActiveMenu(inventoryMenuItems.map(i => i.key)) ? "700" : "500",
              color: "#000"
            }}
          >
            Kho hàng <DownOutlined />
          </Text>
        </Dropdown>

        <Dropdown menu={{ items: costMenuItems }} trigger={['click']} placement="bottom">
          <Text
            style={{
              cursor: "pointer",
              fontWeight: isActiveMenu(costMenuItems.map(i => i.key)) ? "700" : "500",
              color: "#000"
            }}
          >
            Chi phí <DownOutlined />
          </Text>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderComponent;
