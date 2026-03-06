type User = {
  uuid: string;
  username: string;
  createdAt: Date;
};

type Project = {
  uuid: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

type Column = {
  id: number;
  projectUUID: string;
  name: string;
  position: number;
  createdAt: Date;
};

type Role = {
  id: number;
  projectUUID: string;
  name: string;
  description: string;
};

type Permission = {
  id: string;
  name: string;
  description: string;
};

type Member = {
  projectUUID: string;
  userUUID: string;
  roleID: number;
  joinedAt: Date;
};
