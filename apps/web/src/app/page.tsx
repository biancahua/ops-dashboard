'use client';
import Link from "next/link";
import NeedsAttentionQueue from "./components/NeedsAttentionQueue";
import CustomerJourneyView from "./components/CustomerJourneyView";
import QuickStats from "./components/QuickStats";
import { useLoading } from "./components/LoadingContext";
import { useEffect } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Space,
  Button
} from 'antd';
import { 
  ExclamationCircleOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Home() {
  const { setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [setIsLoading]);

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <Title level={1}>Operations Dashboard</Title>
        <Text type="secondary">Monitor AI performance and customer interactions</Text>
      </div>

      <QuickStats 
        title="Health Metrics"
        style={{ marginBottom: '32px' }}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <EyeOutlined />
                Recent Customer Conversations
              </Space>
            }
            extra={
              <Link href="/customer-journey">
                <Button type="link" icon={<EyeOutlined />}>
                  View All
                </Button>
              </Link>
            }
          >
            <CustomerJourneyView />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <ExclamationCircleOutlined />
                Needs Attention Queue
              </Space>
            }
            extra={
              <Link href="/needs-attention">
                <Button type="link" icon={<EyeOutlined />}>
                  View All
                </Button>
              </Link>
            }
          >
            <NeedsAttentionQueue />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
