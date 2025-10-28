import { Modal, Form, Input, Button } from "antd";

type Props = {
  open: boolean;
  onCancel: () => void;
  onFinish: (values: any) => void;
  loading?: boolean;
};

export default function AddFieldModal({ open, onCancel, onFinish, loading }: Props) {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Thêm field mới"
      open={open}
      onCancel={onCancel}
      footer={null}
      confirmLoading={loading}
    >
      <Form
        form={form}
        onFinish={(values) => {
          onFinish(values);
          form.resetFields();
        }}
        layout="vertical"
      >
        <Form.Item
          name="key"
          label="Tên field"
          rules={[{ required: true, message: "Nhập tên field" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="value"
          label="Giá trị"
          rules={[{ required: true, message: "Nhập giá trị" }]}
        >
          <Input />
        </Form.Item>
        <Button htmlType="submit" type="primary" loading={loading}>
          Lưu
        </Button>
      </Form>
    </Modal>
  );
}
