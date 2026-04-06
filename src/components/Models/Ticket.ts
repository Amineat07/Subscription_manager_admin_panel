export type TicketReply = {
  id: number;
  message: string;
  created_by: string;
  role: "admin" | "user";
  created_at: string;
};

export type Ticket = {
  id: number;
  user_id: number;
  title: string;
  message: string;
  status: string;
  created_at: string;
  replies: TicketReply[]; 
};