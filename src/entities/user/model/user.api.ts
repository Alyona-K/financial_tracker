// import axios from "axios";
// import { User } from "./user.types";

// const API_URL = "http://localhost:3001/users";

// export const fetchUserByCredentials = async (
//   email: string,
//   password: string
// ): Promise<User | null> => {
//   const { data } = await axios.get<User[]>(
//     `${API_URL}?email=${email}&password=${password}`
//   );
//   return data.length > 0 ? data[0] : null;
// };

// export const registerUser = async (
//   userData: Omit<User, "id">
// ): Promise<User> => {
//   const { data } = await axios.post<User>(API_URL, {
//     ...userData,
//     id: crypto.randomUUID(),
//   });
//   return data;
// };
