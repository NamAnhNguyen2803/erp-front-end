import React from 'react';
import { Select, Card, Typography, Space } from 'antd';
import { useTheme } from '../contexts/ThemeContext';
import { 
  BulbOutlined, 
  EyeOutlined, 
  HeartOutlined, 
  LeftOutlined,
  RightOutlined,
  UpOutlined,
  DownOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
  UpCircleOutlined,
} from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

const ThemeSelector = () => {
  const { activeThemeName, changeTheme, themes } = useTheme();

  const themeIcons = {
    focus: <EyeOutlined />,
    creative: <BulbOutlined />,
    balance: <LeftOutlined />,
    relax: <HeartOutlined />
  };

  return (
    <Card 
      title="Chọn màu sắc phù hợp với công việc"
      style={{ marginBottom: 24 }}
      size="small"
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Select
          value={activeThemeName}
          onChange={changeTheme}
          style={{ width: '100%' }}
          size="large"
        >
          {Object.entries(themes).map(([key, theme]) => (
            <Option key={key} value={key}>
              <Space>
                {themeIcons[key]}
                {theme.name}
              </Space>
            </Option>
          ))}
        </Select>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {themes[activeThemeName].description}
        </Text>
      </Space>
    </Card>
  );
};

export default ThemeSelector;