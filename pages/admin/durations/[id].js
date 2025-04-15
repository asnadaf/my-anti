import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, InputNumber, Button, message, Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

export default function EditDuration() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      fetchDuration();
    }
  }, [id]);

  const fetchDuration = async () => {
    try {
      const response = await axios.get(`/api/durations/${id}`);
      form.setFieldsValue(response.data.data);
    } catch (error) {
      message.error('Failed to fetch duration');
      router.push('/admin/durations');
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.put(`/api/durations/${id}`, values);
      message.success('Duration updated successfully');
      router.push('/admin/durations');
    } catch (error) {
      message.error('Failed to update duration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Duration</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="max-w-lg"
        >
          <Form.Item
            label="Device Count"
            name="deviceCount"
            rules={[
              { required: true, message: 'Please input the device count!' },
              { type: 'number', min: 1, message: 'Device count must be greater than 0!' }
            ]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          <Form.Item
            label="Device Type"
            name="deviceType"
            rules={[{ required: true, message: 'Please select a device type!' }]}
          >
            <Select placeholder="Select device type">
              <Option value="PC">PC</Option>
              <Option value="Cell">Cell</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Duration"
            name="duration"
            rules={[
              { required: true, message: 'Please input the duration!' },
              { type: 'number', min: 1, message: 'Duration must be greater than 0!' }
            ]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          <Form.Item
            label="Duration Unit"
            name="durationUnit"
            rules={[{ required: true, message: 'Please select a duration unit!' }]}
          >
            <Select placeholder="Select duration unit">
              <Option value="Month">Month</Option>
              <Option value="Year">Year</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Duration
            </Button>
          </Form.Item>
        </Form>
      </div>
      </>  );
} 