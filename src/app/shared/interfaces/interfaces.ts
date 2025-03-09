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

export interface RegisterResponse {
  email: string;
  password: string;
  fullName?: string;
  role?: string;
}

export interface LoginResponse {
  access_token: string;
}
export interface IDocument {
  createdAt: string;
  fileUrl: string;
  id: string;
  name: string;
  status: string;
  updatedAt: string;
}

export interface IDocumentResponse {
  file: FileMetadata;
  name: string;
  status: string;
}

export interface FileMetadata {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

export interface GetDocumentsParams {
  page?: string;
  size?: string;
}


export interface DocumentRequestParams {
  creatorEmail?: string;
  creatorId?: string;
  page?: number;
  size?: number;
  status?: string;
}
