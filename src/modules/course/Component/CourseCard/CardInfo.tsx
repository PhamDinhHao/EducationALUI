import { Space, Avatar, Typography, Tooltip } from "antd";
import { UserOutlined, TeamOutlined, ClockCircleOutlined } from "@ant-design/icons";
const { Text } = Typography;

type Props = {
  teacher: string;
  students: number;
  duration: string;
};

export default function CardInfo({ teacher, students, duration }: Props) {
  return (
    <div style={{ marginTop: 8 }}>
      <Space size="small">
        <Avatar size={24} icon={<UserOutlined />} />
        <Text>{teacher}</Text>
      </Space>
      <Space size="middle" style={{ marginTop: 4 }}>
        <Tooltip title="Học viên">
          <Space>
            <TeamOutlined />
            <Text>{students}</Text>
          </Space>
        </Tooltip>
        <Tooltip title="Thời lượng">
          <Space>
            <ClockCircleOutlined />
            <Text>{duration}</Text>
          </Space>
        </Tooltip>
      </Space>
    </div>
  );
}
