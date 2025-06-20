'use client';
import Link from "next/link";
import { Card, Row, Col, Statistic, Space, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, ExclamationCircleOutlined, ClockCircleOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';
import { useHealthMetrics } from "../hooks/useHealthMetrics";

const { Title } = Typography;

export interface QuickStat {
  title: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  href: string;
  icon: ReactNode;
}

interface QuickStatsProps {
  title?: string;
  gutter?: [number, number];
  style?: React.CSSProperties;
}

export default function QuickStats({ title, gutter = [16, 16], style }: QuickStatsProps) {
  const { data: healthMetrics, isLoading: healthLoading } = useHealthMetrics();

    const stats = [
    {
      title: "AI Resolution Rate",
      value: healthLoading ? "..." : `${((healthMetrics?.resolutionRate || 0) * 100).toFixed(1)}%`,
      suffix: "%",
      description: "Conversations resolved by AI",
      color: "#1890ff",
      trend: undefined,
      href: "/health-metrics",
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
    },
    {
      title: "Escalation Rate",
      value: healthLoading ? "..." : `${((healthMetrics?.escalationRate || 0) * 100).toFixed(1)}%`,
      suffix: "%",
      description: "Conversations escalated to human operator",
      color: "#fa8c16",
      trend: undefined,
      href: "/health-metrics",
      icon: <WarningOutlined style={{ color: '#fa8c16' }} />
    },
    {
      title: "Average Time to Booking",
      value: healthLoading ? "..." : `${healthMetrics?.avgTimeToBooking || 0} min`,
      suffix: " minutes",
      description: "Average time from conversation start to booking",
      color: "#52c41a",
      trend: undefined,
      href: "/health-metrics",
      icon: <ClockCircleOutlined style={{ color: '#1890ff' }} />
    },
    {
      title: "Needs Attention",
      value: healthLoading ? "..." : healthMetrics?.needsAttentionCount || 0,
      description: "Conversations requiring human intervention",
      color: "#f5222d",
      trend: undefined,
      href: "/needs-attention",
      icon: <ExclamationCircleOutlined style={{ color: '#f5222d' }} />
    },
  ];

  return (
    <div>
      {title && <Title level={4}>{title}</Title>}
      <Row gutter={gutter} style={style}>
        {stats.map((stat) => (
          <Col 
            xs={24} 
            sm={12} 
            lg={stats.length === 3 ? 8 : 6} 
            xl={stats.length === 3 ? 8 : 6}
            key={stat.title}
          >
            <Link href={stat.href}>
              <Card hoverable>
                <Statistic
                  title={
                    <Space>
                      {stat.icon}
                      {stat.title}
                    </Space>
                  }
                  value={stat.value}
                  valueStyle={{ color: stat.color }}
                  prefix={
                    stat.trend ? (
                      <span style={{ fontSize: '12px', color: stat.color }}>
                        {stat.trend > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        {stat.trend}
                      </span>
                    ) : undefined
                  }
                />

              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
} 
