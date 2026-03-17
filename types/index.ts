export type TPerson = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  createdAt: string;
};

export type TFileType = "ssn_image" | "csv";

export type TFileRecord = {
  id: string;
  personId: string;
  type: TFileType;
  mimeType: string;
  fileSize: number;
  checksum: string;
  path: string;
  createdAt: string;
};

export type TCreatePersonRequest = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  ssn: string;
};

export type TCreatePersonResponse = {
  personId: string;
};
