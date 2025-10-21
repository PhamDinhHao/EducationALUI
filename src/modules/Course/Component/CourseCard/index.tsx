import { Card } from "antd";
import { useState } from "react";
import { Course } from  "../../types/Course";
import CardHeader from "./CardHeader";
import CardInfo from "./CardInfo";
import CardActions from "./CardActions";
import { AddFieldModal, EditFieldModal, CourseCustomFields } from '@/modules/Course/Component/Cardcustom';

type Props = {
  course: Course;
  isAdmin?: boolean;
  onNavigate?: (url: string) => void;
};

export default function CourseCard({ course, isAdmin, onNavigate }: Props) {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState<{ key: string; value: string } | null>(null);
  const [loading, _] = useState(false);

  const handleNavigate = () => onNavigate?.(`/courses/${course.id}`);
  const handleAddField = async (_values: any) => { /* giống code cũ */ };
  const handleRemoveField = (_key: string) => { /* giống code cũ */ };
  const handleUpdateField = async (_values: any) => { /* giống code cũ */ };

  return (
    <>
      <Card
        hoverable
        onClick={handleNavigate}
        style={{ cursor: "pointer", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
        bodyStyle={{ padding: 16 }}
        cover={<CardHeader title={course.title} img={course.img} price={course.price} />}
        actions={[
          <CardActions onNavigate={handleNavigate} isAdmin={isAdmin} onAddField={() => setOpenAdd(true)} />
        ]}
      >
        <CardInfo teacher={course.teacher} students={course.students} duration={course.duration} />
        {isAdmin && <CourseCustomFields course={course} isAdmin={isAdmin} setOpenEdit={setOpenEdit} handleRemoveField={handleRemoveField} />}
      </Card>

      <AddFieldModal open={openAdd} onCancel={() => setOpenAdd(false)} onFinish={handleAddField} loading={loading} />
      <EditFieldModal open={openEdit} onCancel={() => setOpenEdit(null)} onFinish={handleUpdateField} loading={loading} />
    </>
  );
}
