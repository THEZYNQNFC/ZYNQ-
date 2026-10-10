export interface Lead {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  note?: string;
  createdAt: string;
}
