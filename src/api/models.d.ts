type UUID = `${string}-${string}-${string}-${string}-${string}`;

type User = {
  uuid: UUID;
  username: string;
  createdAt: Date;
};

type Project = {
  uuid: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

type Column = {
  id: number;
  projectUUID: UUID;
  name: string;
  position: number;
  createdAt: Date;
};

type Role = {
  id: number;
  projectUUID: UUID;
  name: string;
  description: string;
};

type Permission = {
  id: string;
  name: string;
  description: string;
};

type Member = {
  projectUUID: UUID;
  userUUID: UUID;
  roleID: number;
  joinedAt: Date;
};
