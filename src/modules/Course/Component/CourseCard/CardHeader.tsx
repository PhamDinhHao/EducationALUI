import { Typography } from "antd";
const { Text } = Typography;

type Props = {
  title: string;
  img: string;
  price?: number;
};

export default function CardHeader({ title, img, price }: Props) {
  return (
    <>
      <img alt={title} src={img} style={{ height: 180, objectFit: "cover" }} />
      <div style={{ marginTop: 8 }}>
        <Text strong style={{ fontSize: 16 }}>{title}</Text>
        {price && <Text strong style={{ marginLeft: 8 }}>{price.toLocaleString()}đ</Text>}
      </div>
    </>
  );
}
