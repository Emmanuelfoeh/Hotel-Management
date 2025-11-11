declare module 'paystack' {
  interface PaystackResponse<T = any> {
    status: boolean;
    message: string;
    data: T;
  }

  interface TransactionInitializeData {
    authorization_url: string;
    access_code: string;
    reference: string;
  }

  interface TransactionVerifyData {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, any>;
    log: any;
    fees: number;
    fees_split: any;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string | null;
    };
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      customer_code: string;
      phone: string | null;
      metadata: any;
      risk_action: string;
    };
    plan: any;
    subaccount: any;
    split: any;
    order_id: any;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    transaction_date: string;
  }

  interface TransactionInitializeOptions {
    email: string;
    amount: number;
    reference?: string;
    callback_url?: string;
    metadata?: Record<string, any>;
    currency?: string;
    plan?: string;
    invoice_limit?: number;
    channels?: string[];
    split_code?: string;
    subaccount?: string;
    transaction_charge?: number;
    bearer?: string;
  }

  interface Transaction {
    initialize(
      options: TransactionInitializeOptions
    ): Promise<PaystackResponse<TransactionInitializeData>>;
    verify(reference: string): Promise<PaystackResponse<TransactionVerifyData>>;
    list(params?: any): Promise<PaystackResponse<any>>;
    fetch(id: string): Promise<PaystackResponse<any>>;
    charge_authorization(params: any): Promise<PaystackResponse<any>>;
    timeline(id_or_reference: string): Promise<PaystackResponse<any>>;
    totals(params?: any): Promise<PaystackResponse<any>>;
    export(params?: any): Promise<PaystackResponse<any>>;
  }

  interface Customer {
    create(params: any): Promise<PaystackResponse<any>>;
    list(params?: any): Promise<PaystackResponse<any>>;
    fetch(email_or_code: string): Promise<PaystackResponse<any>>;
    update(code: string, params: any): Promise<PaystackResponse<any>>;
  }

  interface Plan {
    create(params: any): Promise<PaystackResponse<any>>;
    list(params?: any): Promise<PaystackResponse<any>>;
    fetch(id_or_code: string): Promise<PaystackResponse<any>>;
    update(id_or_code: string, params: any): Promise<PaystackResponse<any>>;
  }

  interface Subscription {
    create(params: any): Promise<PaystackResponse<any>>;
    list(params?: any): Promise<PaystackResponse<any>>;
    fetch(id_or_code: string): Promise<PaystackResponse<any>>;
    enable(params: any): Promise<PaystackResponse<any>>;
    disable(params: any): Promise<PaystackResponse<any>>;
  }

  interface PaystackClient {
    transaction: Transaction;
    customer: Customer;
    plan: Plan;
    subscription: Subscription;
  }

  function Paystack(secretKey: string): PaystackClient;

  export = Paystack;
}
