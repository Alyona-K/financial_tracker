export interface User {
  id: number;      // number, как в db.json
  email: string;
  name?: string;
  avatar?: string;
}

export interface AuthResponse {
  accessToken: string; // <-- важно: json-server-auth возвращает accessToken
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name?: string;
}



// export interface User {
//   id: string;
//   email: string;
//   name: string;
// }

// export interface AuthResponse {
//   token: string;
//   user: User;
// }

// export interface LoginCredentials {
//   email: string;
//   password: string;
// }

// export interface RegisterCredentials extends LoginCredentials {
//   name?: string;
// }