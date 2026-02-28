import type { CommentOut } from "@/lib/types";
import { CommentItem } from "@/components/comment-item";

interface CommentListProps {
  comments: CommentOut[];
  onDeleted: (id: string) => void;
}

export function CommentList({ comments, onDeleted }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-muted text-xs mb-6">no comments yet</p>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onDeleted={onDeleted}
        />
      ))}
    </div>
  );
}
