'use client';
import React from 'react';
import { useHealthMetrics } from '../hooks/useHealthMetrics';
import Link from 'next/link';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Alert, 
  Button, 
  Spin, 
  Typography, 
  Space,
  Divider,
  Tooltip
} from 'antd';
import { 
  ArrowUpOutlined, 
  InfoCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const cardStyles: React.CSSProperties = {
  height: '280px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
}

export default function HealthMetricsPage() {
  const { 
    data: metrics, 
    isLoading, 
    error, 
    isError 
  } = useHealthMetrics();

  if (isLoading) {
    return (
      <div style={{ padding: '32px' }}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>Loading metrics...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: '32px' }}>
        <Alert
          message="Error Loading Metrics"
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

  if (!metrics) {
    return (
      <div style={{ padding: '32px' }}>
        <Alert
          message="No metrics available"
          type="info"
          showIcon
        />
      </div>
    );
  }

  // key metrics
  const resolutionRate = typeof metrics.resolutionRate === 'number' ? metrics.resolutionRate : 0;
  const escalationRate = typeof metrics.escalationRate === 'number' ? metrics.escalationRate : 0;
  const avgTimeToBooking = typeof metrics.avgTimeToBooking === 'number' ? metrics.avgTimeToBooking : 0;

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2}>Health Metrics</Title>
            <Text type="secondary">Comprehensive view of AI performance and conversation outcomes</Text>
          </Col>
          <Col>
            <Link href="/">
              <Button type="link" icon={<ArrowUpOutlined rotate={90} />}>
                Back to Dashboard
              </Button>
            </Link>
          </Col>
        </Row>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        
        <Col xs={24} md={8} lg={8}>
          <Card 
            title={
              <Tooltip title="Conversations resolved by AI without human intervention">
                <Space>
                  AI Resolution Analysis
                  <InfoCircleOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
                </Space>
              </Tooltip>
            } 
            style={cardStyles}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Row justify="space-between" style={{ marginBottom: '8px' }}>
                  <Text>Current Rate</Text>
                  <Text strong>{(resolutionRate * 100).toFixed(2)}%</Text>
                </Row>
                <Progress 
                  percent={resolutionRate * 100} 
                  strokeColor="#1890ff"
                  showInfo={false}
                />
              </div>
              <Paragraph style={{ margin: 0 }}>
                {resolutionRate > 0.8 
                  ? "Excellent performance! AI is successfully handling most conversations independently."
                  : resolutionRate > 0.6
                  ? "Good performance with room for improvement in AI capabilities."
                  : "Performance needs attention. Consider reviewing AI training and escalation triggers."
                }
              </Paragraph>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={8} lg={8}>
          <Card 
            title={
              <Tooltip title="Conversations escalated to human operator for handling">
                <Space>
                  Escalation Analysis
                  <InfoCircleOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
                </Space>
              </Tooltip>
            } 
            style={cardStyles}
          >
            <Space direction="vertical" style={{ width: '100%'}}>
              <div>
                <Row justify="space-between" style={{ marginBottom: '8px'}}>
                  <Text>Current Rate</Text>
                  <Text strong>{(escalationRate * 100).toFixed(2)}%</Text>
                </Row>
                <Progress 
                  percent={escalationRate * 100} 
                  strokeColor="#fa8c16"
                  showInfo={false}
                />
              </div>
              <Paragraph style={{ margin: 0 }}>
                {escalationRate < 0.1 
                  ? "Low escalation rate indicates effective AI handling."
                  : escalationRate < 0.2
                  ? "Moderate escalation rate. Review common escalation reasons."
                  : "High escalation rate. Consider improving AI training or adjusting escalation thresholds."
                }
              </Paragraph>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={8} lg={8}>
          <Card 
            title={
              <Tooltip title="Average time from conversation start to successful booking">
                <Space>
                  Booking Efficiency
                  <InfoCircleOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
                </Space>
              </Tooltip>
            } 
            style={cardStyles}
          >
            <div style={{ textAlign: 'center' }}>
              <Statistic
                value={avgTimeToBooking}
                suffix="min"
                valueStyle={{ color: '#52c41a', fontSize: '32px' }}
              />
              <Text type="secondary">Average time to booking</Text>
              <Divider />
              <Row justify="space-between">
                <Col>
                  <Text type="secondary">Target</Text>
                  <br />
                  <Text strong>≤ 5.0 min</Text>
                </Col>
                <Col>
                  <Text type="secondary">Current</Text>
                  <br />
                  <Text strong style={{ color: avgTimeToBooking <= 3 ? '#52c41a' : '#fa8c16' }}>
                    {avgTimeToBooking.toFixed(1)} min
                  </Text>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
} 
