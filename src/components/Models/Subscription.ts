export type Company = {
  id: number;
  company_name: string;
  category: string;
  contact_detail: string;
  link: string;
};

export type Tag = {
  id: number;
  tag_name: string;
  tag_color: string;
};

export type Subscription = {
  id: number;
  user_id: number;
  user_email: string;

  subscription_name: string;
  typ: string;

  contract_number: string;
  customer_number: string;

  payment_method: string;
  billing_period: string;

  note: string;

  cancellation_period: number | null;
  billing_date: number;

  price: number;

  contract_start_date: string | null;
  contract_end_date: string | null;

  created_at?: string;
  updated_at?: string | null;

  company: Company;
  tag: Tag;
};