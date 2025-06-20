'use client';
import React, { useState } from 'react';
import { useNeedsAttentionQueue } from '../hooks/useNeedsAttentionQueue';
import Link from 'next/link';
import { getUrgencyColor, getUrgencyLabel, formatTimestamp, formatFullTimestamp } from '../utils/utils';
import { 
  Card, 
  Row, 
  Col, 
  Select, 
  Button, 
  List, 
  Tag, 
  Typography, 
  Space, 
  Spin, 
  Alert,
  Avatar,
  Statistic,
  Empty,
  Badge
} from 'antd';
import { 
  ExclamationCircleOutlined, 
  ClockCircleOutlined, 
  MessageOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

export default function NeedsAttentionPage() {
  const { 
    data: messages, 
    isLoading, 
    error, 
    isError 
  } = useNeedsAttentionQueue();

  const [sortBy, setSortBy] = useState<'urgency' | 'urgency_desc' | 'timestamp' | 'timestamp_desc'>('urgency');

  if (isLoading) {
    return (
      <div style={{ padding: '32px' }}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>Loading queue...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: '32px' }}>
        <Alert
          message="Error Loading Queue"
          description={error instanceof Error ? error.message : 'An unexpected error occurred'}
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div style={{ padding: '32px' }}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Title level={3}>No Conversations Need Attention</Title>
                <Text type="secondary">All conversations are being handled successfully!</Text>
              </div>
            }
          />
          <div style={{ marginTop: '24px' }}>
            <Link href="/">
              <Button type="primary" icon={<ArrowLeftOutlined />}>
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredMessages = messages
    .sort((a, b) => {
      if (sortBy === 'urgency') {
        if (b.urgency !== a.urgency) {
          return b.urgency - a.urgency;
        }
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      } else if (sortBy === 'urgency_desc') {
        if (b.urgency !== a.urgency) {
          return a.urgency - b.urgency;
        }
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else if (sortBy === 'timestamp') {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      } else if (sortBy === 'timestamp_desc') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      return 0;
    });

  const attentionQueueDetails = [
    {
      title: "Total Waiting",
      value: messages.length,
      key: "total-waiting",
      style: {
        color: '#1890ff'
      },
      prefix: <MessageOutlined />
    },
    {
      title: "Critical Priority",
      value: messages.filter(m => m.urgency >= 8).length,
      key: "critical-priority", 
      style: {
        color: '#f5222d'
      },
      prefix: <ExclamationCircleOutlined />
    },
    {
      title: "High Priority",
      value: messages.filter(m => m.urgency >= 5 && m.urgency < 8).length,
      key: "high-priority",
      style: {
        color: '#fa8c16'
      },
      prefix: <ExclamationCircleOutlined />
    },
    {
      title: "Avg Wait Time",
      value: "~15",
      style: {
        color: '#fa8c16'
      },
      suffix: "min",
      key: "avg-wait-time",
      prefix: <ClockCircleOutlined />
    }
  ]

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2}>Needs Attention Queue</Title>
            <Text type="secondary">
              {messages.length} conversations requiring human intervention
            </Text>
          </Col>
          <Col>
            <Link href="/">
              <Button type="link" icon={<ArrowLeftOutlined />}>
                Back to Dashboard
              </Button>
            </Link>
          </Col>
        </Row>
      </div>

      <Row gutter={16} style={{ marginTop: '32px', marginBottom: '32px' }}>
        {attentionQueueDetails.map((detail) => (
          <Col xs={24} md={6} key={detail.key}>
            <Card >
              <Statistic
                title={detail.title}
                value={detail.value}
                prefix={detail.prefix}
                suffix={detail.suffix}
                valueStyle={detail.style}              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col>
            <Text strong style={{ marginRight: '8px' }}>Sort by:</Text>
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 200 }}
            >
              <Option value="urgency">Urgency (High to Low)</Option>
              <Option value="urgency_desc">Urgency (Low to High)</Option>
              <Option value="timestamp">Time (Oldest First)</Option>
              <Option value="timestamp_desc">Time (Newest First)</Option>
            </Select>
          </Col>
          
          <Col flex="auto" style={{ textAlign: 'right' }}>
            <Text type="secondary">
              Showing {filteredMessages.length} of {messages.length} conversations
            </Text>
          </Col>
        </Row>
      </Card>

      <List
        dataSource={filteredMessages}
        renderItem={(message) => (
          <List.Item style={{ padding: '16px 0' }}>
            <Card 
              style={{ 
                width: '100%',
                borderColor: getUrgencyColor(message.urgency, 'page')
              }}
            >
              <List.Item.Meta
                avatar={
                  <Badge count={message.urgency} showZero>
                    <Avatar 
                      icon={<ExclamationCircleOutlined />} 
                      style={{ backgroundColor: getUrgencyColor(message.urgency, 'page') }}
                    />
                  </Badge>
                }
                title={
                  <Space>
                    <Text strong style={{ fontSize: '16px' }}>
                      {message.phone}
                    </Text>
                    <Tag color={getUrgencyColor(message.urgency, 'page')}>
                      {getUrgencyLabel(message.urgency)} Priority
                    </Tag>
                    <Text type="secondary">
                      <ClockCircleOutlined /> {formatTimestamp(message.timestamp)}
                    </Text>
                  </Space>
                }
                description={
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text strong>Last Message:</Text>
                      <Paragraph style={{ margin: '8px 0' }}>
                        {message.content}
                      </Paragraph>
                    </div>
                    
                    {message.reason && (
                      <div>
                        <Text strong>Escalation Reason:</Text>
                        <Paragraph style={{ margin: '8px 0' }}>
                          {message.reason}
                        </Paragraph>
                      </div>
                    )}

                    <Space>
                      <Text type="secondary">Urgency: {message.urgency}/10</Text>
                      <Text type="secondary">Sender: {message.sender_type}</Text>
                      <Text type="secondary">Time: {formatFullTimestamp(message.timestamp)}</Text>
                    </Space>
                  </Space>
                }
              />
              
              <div style={{ marginTop: '16px', textAlign: 'right' }}>
                <Space>
                  <Link href={`/customer-journey/${message.phone}`}>
                    <Button type="primary" icon={<EyeOutlined />} disabled>
                      View Journey
                    </Button>
                  </Link>
                  <Button type="primary" icon={<CheckCircleOutlined />} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }} disabled>
                    Mark Resolved
                  </Button>
                </Space>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
} 
