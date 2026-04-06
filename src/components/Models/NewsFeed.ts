export type NewsFeed = {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  is_published: boolean;
  scheduled_at?: string;
  created_at: string;
};