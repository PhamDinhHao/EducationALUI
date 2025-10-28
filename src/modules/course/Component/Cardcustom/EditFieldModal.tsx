import { Modal, Form, Input, Button } from "antd";

type Props = {
  open: { key: string; value: string } | null;
  onCancel: () => void;
  onFinish: (values: any) => void;
  loading?: boolean;
};

export default function EditFieldModal({ open, onCancel, onFinish, loading }: Props) {
  const [form] = Form.useForm();

  if (open) form.setFieldsValue(open);

  return (
    <Modal
      title="Cập nhật field"
      open={!!open}
      onCancel={onCancel}
      footer={null}
      confirmLoading={loading}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="key" label="Tên field">
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="value"
          label="Giá trị"
          rules={[{ required: true, message: "Nhập giá trị" }]}
        >
          <Input />
        </Form.Item>
        <Button htmlType="submit" type="primary" loading={loading}>
          Cập nhật
        </Button>
      </Form>
    </Modal>
  );
}
