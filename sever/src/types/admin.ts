export interface IAdminInfo {
  id: string;
  username: string;
  realName: string;
  role: string;
  avatar?: string;
  status: number;
  permissions: string[];
  lastLoginTime?: Date;
  lastLoginIp?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminLoginResult {
  token: string;
  admin: IAdminInfo;
}

export interface IPageParams {
  page: number;
  pageSize: number;
}

export interface IPageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
