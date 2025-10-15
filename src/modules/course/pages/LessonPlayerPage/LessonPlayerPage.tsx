import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, Alert } from "antd";
import LessonVideo from "./LessonVideo.tsx";
import CommentList, { CommentItem } from "./CommentList.tsx";
import { Lesson } from "@/modules/course/types/Course.ts";
import { useBoundStore } from "@shared/stores";

const LessonPlayerPage = () => {
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentVisible, setCommentVisible] = useState(true);

  const user = useBoundStore((state) => state.user);

  // Lấy comment ban đầu
  const fetchComments = async () => {
    if (!id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/v1/comment/lessons/${id}/comments`);
      if (!res.ok) throw new Error("Lỗi khi tải bình luận");
      const data: CommentItem[] = await res.json();
      setComments(data);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi tải bình luận");
    }
  };

  useEffect(() => {
    const fetchLessonAndComments = async () => {
      setLoading(true);
      setError("");
      try {
        const lessonRes = await fetch(`http://localhost:5000/api/v1/lesson/${id}`);
        if (!lessonRes.ok) throw new Error("Lỗi khi tải bài học");
        const lessonData = await lessonRes.json();
        setLesson(lessonData);

        await fetchComments();
      } catch (err: any) {
        setError(err.message || "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchLessonAndComments();
  }, [id]);

  // Tạo comment cha hoặc reply
  const handleAddComment = async (parentId?: string, content?: string) => {
    const bodyContent = content || newComment;
    if (!bodyContent?.trim()) return;

    const authorName = user?.name || "Bạn";

    try {
      const res = await fetch(`http://localhost:5000/api/v1/comment/lessons/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: authorName,
          content: bodyContent,
          parentId: parentId || null,
        }),
      });

      if (!res.ok) throw new Error("Không thể gửi bình luận");

      const newCommentData: CommentItem = await res.json();

      // Nếu là reply → chèn vào đúng comment cha
      if (parentId) {
        setComments(prev =>
          prev.map(c =>
            c.id === parentId
              ? { ...c, replies: [...(c.replies || []), newCommentData] }
              : c
          )
        );
      } else {
        // Comment cha
        setComments(prev => [newCommentData, ...prev]);
        setNewComment("");
      }

    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi gửi bình luận");
    }
  };

  if (loading) return <Spin size="large" style={{ margin: 24 }} />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon style={{ margin: 24 }} />;
  if (!lesson) return <p>Bài học không tồn tại.</p>;

  return (
    <div style={{ display: "flex", gap: 24, padding: 24, flexDirection: commentVisible ? "row" : "column" }}>
      <LessonVideo
        title={lesson.title}
        src={lesson.src}
        duration={lesson.duration.toString()}
        updatedAt={lesson.updatedAt}
        commentVisible={commentVisible}
        toggleComment={() => setCommentVisible(!commentVisible)}
      />
      <CommentList
        comments={comments}
        visible={commentVisible}
        newComment={newComment}
        setNewComment={setNewComment}
        onAddComment={handleAddComment}
      />
    </div>
  );
};

export default LessonPlayerPage;
