export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; 
  avatar: string;
  location?: string;
}

export type UpdateUserPayload = Partial<
  Omit<User, "id" | "email"> 
>;


