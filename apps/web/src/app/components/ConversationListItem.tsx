import { Space, List, Avatar, Tag, Typography } from "antd";
import { PhoneOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { formatFullTimestamp, getStatusColor, getStatusLabel } from "../utils/utils";

export interface ConversationSummary {
  phone: number;
  lastMessage: string;
  status: string;
  timestamp: string;
  job_type: string | null;
  messageCount: number;
}

const { Text, Paragraph } = Typography;

export const ConversationListItem = ({ 
    conversation, 
    isSelected, 
    onSelect 
  }: { 
    conversation: ConversationSummary; 
    isSelected: boolean; 
    onSelect: (phone: number) => void; 
  }) => (
    <List.Item
      style={{ 
        padding: '16px',
        cursor: 'pointer',
        backgroundColor: isSelected ? '#f0f8ff' : 'transparent',
        border: isSelected ? '1px solid #91d5ff' : '1px solid transparent'
      }}
      onClick={() => onSelect(conversation.phone)}
    >
      <List.Item.Meta
        avatar={<Avatar icon={<PhoneOutlined />} />}
        title={
          <Space>
            <Text strong>{conversation.phone}</Text>
            <Tag color={getStatusColor(conversation.status)}>
              {getStatusLabel(conversation.status)}
            </Tag>
          </Space>
        }
        description={
          <Space direction="vertical" style={{ width: '100%' }}>
            <Paragraph 
              ellipsis={{ rows: 2 }} 
              style={{ margin: 0, fontSize: '14px' }}
            >
              {conversation.lastMessage}
            </Paragraph>
            <Space>
              {conversation.job_type && (
                <Tag color="blue">{conversation.job_type}</Tag>
              )}
              <Text type="secondary" style={{ fontSize: '12px' }}>
                <ClockCircleOutlined /> {formatFullTimestamp(conversation.timestamp)}
              </Text>
            </Space>
          </Space>
        }
      />
    </List.Item>
  );