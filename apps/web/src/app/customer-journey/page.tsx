'use client';

import React, { useState, useMemo } from 'react';
import { useCustomerJourney } from '../hooks/useCustomerJourney';
import Link from 'next/link';
import { 
  Card, 
  Row, 
  Col, 
  Input, 
  Button, 
  List, 
  Typography, 
  Space, 
  Spin, 
  Empty
} from 'antd';
import { 
  ClearOutlined, 
  MessageOutlined, 
  ArrowLeftOutlined
} from '@ant-design/icons';
import { ConversationListItem } from '../components/ConversationListItem';
import { MessageItem } from '../components/MessageItem';
import { useUniqueCustomers } from '../hooks/useGetUniqueCustomers';

const { Search } = Input;
const { Title, Text } = Typography;

export default function CustomerJourneyPage() {
  const [selectedPhone, setSelectedPhone] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { data: journeyData, isLoading: journeyLoading } = useCustomerJourney(selectedPhone);
  const { data: uniqueCustomers, isLoading: uniqueCustomersLoading } = useUniqueCustomers();

  const filteredConversations = useMemo(() => {
    if (!searchTerm.trim()) return uniqueCustomers;
    
    const term = searchTerm.toLowerCase();
    return uniqueCustomers?.filter(conversation =>
      conversation.phone.toString().includes(searchTerm) ||
      conversation.job_type?.toLowerCase().includes(term) ||
      conversation.status.toLowerCase().includes(term)
    );
  }, [uniqueCustomers, searchTerm]);

  const handleConversationSelect = (phone: number) => {
    setSelectedPhone(phone.toString());
  };

  const handleSearchClear = () => {
    setSearchTerm('');
  };

  if (uniqueCustomersLoading || journeyLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Loading conversations...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2}>Customer Journey View</Title>
            <Text type="secondary">View and analyze customer conversation histories</Text>
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

      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Search
              placeholder="Search by phone number, job type, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              enterButton
            />
          </Col>
          <Col>
            <Button 
              icon={<ClearOutlined />} 
              onClick={handleSearchClear}
            >
              Clear
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={24}>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <MessageOutlined />
                Recent Conversations
              </Space>
            }
            style={{ height: '600px' }}
            styles={{ body: { padding: 0, height: 'calc(100% - 57px)', overflow: 'auto' } }}
          >
            {uniqueCustomersLoading ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px' }}>Loading conversations...</div>
              </div>
            ) : (
            <List
              dataSource={filteredConversations}
              renderItem={(conversation) => (
                <ConversationListItem 
                  conversation={conversation} 
                  isSelected={selectedPhone === conversation.phone.toString()} 
                  onSelect={handleConversationSelect}
                />
              )}
            />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <MessageOutlined />
                Conversation Detail
              </Space>
            }
            style={{ height: '600px' }}
            styles={{ body: { padding: 0, height: 'calc(100% - 57px)', overflow: 'auto' } }}
          >
            {!selectedPhone ? (
              <Empty 
                description="Select a conversation to view details"
                style={{ margin: '100px 0' }}
              />
            ) : journeyLoading ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px' }}>Loading conversation...</div>
              </div>
            ) : journeyData ? (
              <div style={{ padding: '16px' }}>
                <List
                  dataSource={journeyData}
                  renderItem={(message) => (
                    <MessageItem message={message} />
                  )}
                />
              </div>
            ) : (
              <Empty 
                description="No conversation data available"
                style={{ margin: '100px 0' }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
} 
