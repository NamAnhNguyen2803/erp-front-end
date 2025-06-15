import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { useTheme } from '../contexts/ThemeContext';
import ThemeSelector from '../components/ThemeSelector';
import ThemeButton from '../components/ThemeButton';

const Dashboard = () => {
  const { currentTheme } = useTheme();

  return (
    <div>
      <ThemeSelector />
      
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card 
            style={{ 
              borderColor: currentTheme.primary,
              backgroundColor: currentTheme.cardBg 
            }}
          >
            <Statistic
              title="Tổng sản phẩm"
              value={1128}
              valueStyle={{ color: currentTheme.primary }}
            />
          </Card>
        </Col>
        {/* Các card khác... */}
      </Row>

      <div style={{ marginTop: 24 }}>
        <ThemeButton buttonType="creative">
          Tạo kế hoạch mới
        </ThemeButton>
        <ThemeButton style={{ marginLeft: 8 }}>
          Xem báo cáo
        </ThemeButton>
        <ThemeButton buttonType="balance" style={{ marginLeft: 8 }}>
          Bắt đầu sản xuất
        </ThemeButton>
      </div>
    </div>
  );
};

export default Dashboard;