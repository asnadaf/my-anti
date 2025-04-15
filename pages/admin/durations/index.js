import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Table, Button, message, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function Durations() {
  const [durations, setDurations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDurations = async () => {
    try {
      const response = await axios.get('/api/durations');
      setDurations(response.data.data);
    } catch (error) {
      message.error('Failed to fetch durations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDurations();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/durations/${id}`);
      message.success('Duration deleted successfully');
      fetchDurations();
    } catch (error) {
      message.error('Failed to delete duration');
    }
  };

  const columns = [
    {
      title: 'Device Count',
      dataIndex: 'deviceCount',
      key: 'deviceCount',
      sorter: (a, b) => a.deviceCount - b.deviceCount,
    },
    {
      title: 'Device Type',
      dataIndex: 'deviceType',
      key: 'deviceType',
      render: (deviceType) => (
        <Tag color={deviceType === 'PC' ? 'blue' : 'green'}>
          {deviceType}
        </Tag>
      ),
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_, record) => (
        <span>{record.duration} {record.durationUnit}{record.duration > 1 ? 's' : ''}</span>
      ),
      sorter: (a, b) => {
        // Convert to months for sorting
        const aMonths = a.durationUnit === 'Year' ? a.duration * 12 : a.duration;
        const bMonths = b.durationUnit === 'Year' ? b.duration * 12 : b.duration;
        return aMonths - bMonths;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="space-x-2">
          <Link href={`/admin/durations/${record._id}`}>
            <Button type="primary" icon={<EditOutlined />} />
          </Link>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Durations</h1>
          <Link href="/admin/durations/new">
            <Button type="primary" icon={<PlusOutlined />}>
              Add Duration
            </Button>
          </Link>
        </div>
        <Table
          columns={columns}
          dataSource={durations}
          rowKey="_id"
          loading={loading}
        />
      </div>
    </>
  );
} 