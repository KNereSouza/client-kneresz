export interface PostOut {
  id: string;
  title: string;
  slug: string;
  body: string;
  tags: string[];
  status: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostList {
  items: PostOut[];
  total: number;
}

export interface PostCreate {
  title: string;
  body: string;
  tags: string[];
}

export interface PostUpdate {
  title?: string;
  body?: string;
  tags?: string[];
  status?: string;
}

export interface CommentOut {
  id: string;
  post_id: string;
  user_id: string;
  github_username: string;
  avatar_id: number;
  body: string;
  deleted_at: string | null;
  created_at: string;
}

export interface CommentCreate {
  body: string;
}

export interface UserOut {
  id: string;
  github_id: number;
  github_username: string;
  avatar_id: number;
  is_admin: boolean;
  created_at: string;
}

export interface MediaOut {
  id: string;
  url: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  created_at: string;
}

export interface GCResponse {
  deleted_count: number;
  deleted_ids: string[];
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface PurgeConfirm {
  confirm: string;
}
