export type UserType = {
  id: string;
  username: string;
  email: string;
  verified: boolean;
  role: "OWNER" | "USER";
};

