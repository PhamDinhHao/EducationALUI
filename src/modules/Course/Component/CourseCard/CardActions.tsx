import { Button } from "antd";

type Props = {
  onNavigate: () => void;
  isAdmin?: boolean;
  onAddField?: () => void;
};

export default function CardActions({ onNavigate, isAdmin, onAddField }: Props) {
  return (
    <>
      <Button type="primary" onClick={(e) => { e.stopPropagation(); onNavigate(); }}>Xem chi tiết</Button>
      {isAdmin && <Button size="small" onClick={(e) => { e.stopPropagation(); onAddField?.(); }}>+ Thêm field</Button>}
    </>
  );
}
