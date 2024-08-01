export interface ICredential {
  username: string;
  password: string;
}

export interface APIResponse {
  success: boolean;
  message: string;
  data: any | any[] | null;
  count?: number;
}

export interface User {
  id: number;
  username: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
}
