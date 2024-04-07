type post = {
  category: string;
  content: string;
  id: number;
  image: string;
  publishedAt: string;
  slug: string;
  status: string;
  thumbnail: string;
  title: string;
  updatedAt: string;
  url: string;
  userId: number;
};

export interface IPostsSchema {
  postsArr: post[];
  status: "loading" | "resolved" | "rejected" | null;
  error: string | null;
}
