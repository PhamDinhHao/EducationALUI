import { useState } from "react";
import { List, Avatar, Button, Modal, Input, Typography, Space, message } from "antd";
import { LikeOutlined, LikeFilled, MessageOutlined } from "@ant-design/icons";
import { useBoundStore } from "@shared/stores";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Text } = Typography;

export interface CommentItem {
  id: string;
  author: string;
  content: string;
  avatar?: string;
  createdAt: string;
  likes?: number;
  replies?: CommentItem[];
}

interface CommentListProps {
  comments: CommentItem[];
  visible: boolean;
  newComment: string;
  setNewComment: (val: string) => void;
  onAddComment: (parentId?: string, content?: string) => void;
}

export default function CommentList({
  comments,
  visible,
  newComment,
  setNewComment,    
  onAddComment,
}: CommentListProps) {
  const [likeState, setLikeState] = useState<{ [key: string]: number }>({});
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyTextMap, setReplyTextMap] = useState<{ [key: string]: string }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const user = useBoundStore(state => state.user);

  if (!visible) return null;

  const handleLike = (id: string) => {
    setLikeState(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleReply = async (parentId: string) => {
    const content = replyTextMap[parentId]?.trim();
    if (!content) return;

    await onAddComment(parentId, content);

    setReplyTextMap(prev => ({ ...prev, [parentId]: "" }));
    setReplyingId(null);
    message.success("Gửi phản hồi thành công!");
  };

  // Hàm đếm tổng số comment (bao gồm cả reply)
  const countComments = (comments: CommentItem[]): number => {
    let total = 0;
    const countRecursive = (items: CommentItem[]) => {
      for (const item of items) {
        total += 1;
        if (item.replies && item.replies.length > 0) {
          countRecursive(item.replies);
        }
      }
    };
    countRecursive(comments);
    return total;
  };

  // Format thời gian
  const formatTime = (isoString: string) => dayjs(isoString).format("HH:mm DD/MM/YYYY");

  const renderCommentReply = (replies: CommentItem[] = []) =>
    replies.map(reply => (
      <List.Item
        key={reply.id}
        style={{
          padding: "8px 12px",
          marginBottom: 8,
          borderRadius: 6,
          background: "#fff",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          width: "350px",
          whiteSpace: "normal",
          wordBreak: "break-word",
          position: "relative",
          marginLeft: 40,
        }}
      >
        <Avatar
          src={reply.avatar || "https://i.pravatar.cc/40"}
          style={{ flexShrink: 0, marginRight: 12, width: 40, height: 40 }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {reply.author === user?.name ? "Bạn" : reply.author}
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.4 }}>{reply.content}</div>
        </div>
      </List.Item>
    ));

  const renderComment = (item: CommentItem) => (
    <List.Item
      key={item.id}
      style={{
        padding: "12px 16px",
        marginBottom: 12,
        borderRadius: 8,
        background: '#fff',
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <List.Item.Meta
        avatar={<Avatar src={item.avatar || "https://i.pravatar.cc/40"} />}
        title={
          <span style={{ whiteSpace: "normal", fontWeight: 600 , display: "inline-block"}}>
            {item.author === user?.name ? "Bạn" : item.author}
          </span>
        }
        description={
          <div style={{ whiteSpace: "normal", display: "inline-block" }}>
            <Text>{item.content}</Text>
            <div style={{ marginTop: 6, fontSize: 12, color: "#888" }}>
              {item.replies && item.replies.length > 0
                ? `Có ${item.replies.length} phản hồi`
                : "Chưa có phản hồi"}
            </div>
            <div style={{ marginTop: 8 }}>
              <Space size="middle">
                <Button
                  type="text"
                  size="small"
                  icon={likeState[item.id] ? <LikeFilled style={{ color: "red" }} /> : <LikeOutlined />}
                  onClick={() => handleLike(item.id)}
                >
                  {likeState[item.id] || 0}
                </Button>
                <Button
                  type="text"
                  size="small"
                  icon={<MessageOutlined />}
                  onClick={() => setReplyingId(replyingId === item.id ? null : item.id)}
                >
                  Trả lời
                </Button>
              </Space>

              {replyingId === item.id && (
                <div style={{ marginTop: 8 }}>
                  <TextArea
                    rows={2}
                    placeholder="Nhập phản hồi..."
                    value={replyTextMap[item.id] || ""}
                    onChange={e =>
                      setReplyTextMap(prev => ({ ...prev, [item.id]: e.target.value }))
                    }
                    style={{ width: "300px" }}
                  />
                  <Button
                    type="primary"
                    size="small"
                    style={{ marginTop: 4 }}
                    onClick={() => handleReply(item.id)}
                  >
                    Gửi
                  </Button>
                </div>
              )}
            </div>
          </div>
        }
      />
      {item.replies && item.replies.length > 0 && renderCommentReply(item.replies)}
    </List.Item>
  );

  return (
    <div
      style={{
        flex: 1,
        maxHeight: "calc(100vh - 100px)",
        overflowY: "auto",
        backgroundColor: '#fff',
        borderLeft: '5px solid #3e1414ff',
        border: '4px solid black',
        padding: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 12px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
      }}
    >
      <Button 
        type="primary"
        icon={<MessageOutlined />}
        onClick={() => setModalVisible(true)}
        style={{
          borderRadius: 8,
          border: "1px solid #ffaa18ff",
          color: "#ffae18ff",
          fontWeight: 500,
          marginBottom: 16,
          backgroundColor: "#fff",
          width : '200px',
          height : '50px'
        }}
      >
        Hỏi đáp
      </Button>

      {/* Header tổng số comment */}
      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>
        Tổng số bình luận: {countComments(comments)}
      </div>

      <TextArea
        rows={2}
        placeholder="Nhập bình luận mới của bạn"
        value={newComment}
        onChange={e => setNewComment(e.target.value)}
        style={{
          border: '1px solid #ccc',
          borderRadius: '6px',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '8px',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLTextAreaElement).style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          (e.currentTarget as HTMLTextAreaElement).style.borderColor = '#40a9ff';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLTextAreaElement).style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          (e.currentTarget as HTMLTextAreaElement).style.borderColor = '#ccc';
        }}
      />
      <Button type="primary" block style={{ marginTop: 8 }} onClick={() => onAddComment()}>
        Gửi
      </Button>

      <List
        dataSource={comments}
        itemLayout="horizontal"
        style={{ maxHeight: 400, overflowY: "auto", backgroundColor: '#fff' }}
        renderItem={renderComment}
      />

      {/* Modal */}
      <Modal
        title="Hỏi đáp"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        centered
        maskClosable
        width={600}
      >
        {/* Header tổng số comment trong modal */}
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>
          Tổng số bình luận: {countComments(comments)}
        </div>

        <TextArea
          rows={2}
          placeholder="Nhập bình luận mới của bạn"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          style={{
            border: '1px solid #ccc',
            borderRadius: '6px',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            padding: '8px',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLTextAreaElement).style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            (e.currentTarget as HTMLTextAreaElement).style.borderColor = '#40a9ff';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLTextAreaElement).style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            (e.currentTarget as HTMLTextAreaElement).style.borderColor = '#ccc';
          }}
        />
        <Button type="primary" block style={{ marginTop: 8 }} onClick={() => onAddComment()}>
          Gửi
        </Button>

        <List
          dataSource={comments}
          itemLayout="horizontal"
          style={{ marginTop: 16, maxHeight: 400, overflowY: "auto" }}
          renderItem={renderComment}
        />
      </Modal>
    </div>
  );
}
