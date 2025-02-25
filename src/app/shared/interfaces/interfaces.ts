export interface IUser {
  email: string,
  fullName: string,
  id: string,
  role: string,
}

export interface IDocument {
  name: string,
  status: string,
  createdAt: string,
  updatedAt: string,
  creator: IUser,
}

export interface IResponse {
  results: IUser[],
  count: number,
}
