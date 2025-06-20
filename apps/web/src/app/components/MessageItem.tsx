import { Space, List, Avatar, Tag, Typography } from "antd";
import { RobotOutlined, UserOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

export interface CustomerMessage {
    id: string;
    phone: number;
    sender_type: 'customer' | 'agent' | 'operator';
    content: string;
    status: string;
    reason: string | null;
    job_type: string | null;
    urgency: number;
    operator_id: string | null;
    timestamp: string;
    actions: Array<{
      type: string;
      result: string;
      error: string | null;
    }>;
  }

const getMessageAvatar = (senderType: string) => {
    switch (senderType) {
      case 'customer':
        return <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />;
      case 'agent':
      case 'operator':
        return <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52c41a' }} />;
      default:
        return <Avatar icon={<UserOutlined />} />;
    }
  };

export const MessageItem = ({ message }: { message: CustomerMessage }) => (
    <List.Item style={{ padding: '8px 0', border: 'none' }}>
      <List.Item.Meta
        avatar={getMessageAvatar(message.sender_type)}
        title={
          <Space>
            <Text strong style={{ textTransform: 'capitalize' }}>
              {message.sender_type}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {new Date(message.timestamp).toLocaleTimeString()}
            </Text>
          </Space>
        }
        description={
          <Space direction="vertical" style={{ width: '100%' }}>
            <Paragraph style={{ margin: 0 }}>
              {message.content}
            </Paragraph>
            {message.actions && message.actions.length > 0 && (
              <Space wrap>
                {message.actions.map((action, actionIndex) => (
                  <Tag 
                    key={actionIndex}
                    color={action.result === 'success' ? 'green' : 'red'}
                  >
                    {action.type}
                  </Tag>
                ))}
              </Space>
            )}
          </Space>
        }
      />
    </List.Item>
  );