export interface TransactionRecord {
  id: number;
  type: 'DEPO' | 'WD';
  agent_id: number;
  member_id: number;
  username: string;
  amount: string;
  real_amount: string;
  status: string;
  transaction_code: string;
  from: string;
  from_name: string;
  from_number: string;
  to: string;
  to_name: string;
  to_number: string;
  hash: string;
  network: string;
  remark: string;
  currency: string;
  submit_date: string;
  transfer_date: string;
  update_by: string;
  update_date: string;
  auto_state: string;
  retry_count: number;
  retry_time: string;
  nickname: string;
  country: string;
  city: string;
  ip_address: string;
  old_balance: string;
  token_address: string;
  origin: string;
  method: string;
  chain_id?: string;
  hash_url?: string;
}

export interface DepoWdHistoryRequest {
  username: string;
  password: string;
  from_date: string;
  to_date: string;
  transaction_type?: 'DEPO' | 'WD' | '';
  transaction_status?: 'SUCCESS' | 'REJECTED' | 'PENDING' | '';
  limit?: number;
  page_number?: number;
}

export interface DepoWdHistoryResponse {
  error: boolean;
  message: string;
  total_data: number;
  page: string;
  data: TransactionRecord[];
}
