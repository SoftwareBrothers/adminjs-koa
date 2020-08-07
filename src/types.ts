export type AuthObject = {
  email: string;
  password: string;
}

export type Auth = {
  authenticate: { (email: AuthObject['email'], password: AuthObject['password']): Promise<AuthObject | null> };
  cookiePassword: string;
}
