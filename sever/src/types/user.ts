export interface IUserInfo {
  id: string;
  openid: string;
  nickname: string;
  avatar: string;
  province: string;
  totalStars: number;
  levelCount: number;
  coins: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoginResult {
  token: string;
  user: IUserInfo;
}

export interface IUpdateUserParams {
  nickname?: string;
  avatar?: string;
  province?: string;
}

export interface IInitProvinceParams {
  province: string;
  method: 'auto' | 'select';
}

export interface ITicketStatus {
  adventureTickets: {
    current: number;
    max: number;
    nextRecoverIn: number;
  };
  randomTickets: {
    current: number;
    max: number;
  };
}
