export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // не обязательно хранить, но для формы можно
  avatar: string;
  location?: string;
}

export type UpdateUserPayload = Partial<
  Omit<User, "id" | "email"> // email обычно нельзя менять
>;


