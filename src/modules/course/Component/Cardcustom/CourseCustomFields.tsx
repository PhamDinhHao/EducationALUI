import { Button, Space } from "antd";
import { Course } from "@/modules/course/types/Course.ts";

type Props = {
  course: Course;
  isAdmin?: boolean;
  setOpenEdit: (value: { key: string; value: string } | null) => void;
  handleRemoveField: (key: string) => void;
};

export default function CourseCustomFields({ course, isAdmin, setOpenEdit, handleRemoveField }: Props) {
  return (
    <>
      {Object.entries(course.customFields ?? {}).map(([key, value]) => (
        <p key={key} style={{ marginTop: 8 }}>
          <b>{key}:</b> {String(value)}{" "}
          {isAdmin && (
            <Space>
              <Button
                type="link"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenEdit({ key, value: String(value) });
                }}
              >
                Sửa
              </Button>
              <Button
                type="link"
                size="small"
                danger
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveField(key);
                }}
              >
                Xoá
              </Button>
            </Space>
          )}
        </p>
      ))}
    </>
  );
}
