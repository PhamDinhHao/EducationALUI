import { Role } from "@/shared/core/enum/role.enum";

export type User = {
  id: number;
  email: string;
  name: string;
  lineChannelAccessToken?: string;
  role: Role;
  updatedAt: Date;
  createdAt: Date;
};
