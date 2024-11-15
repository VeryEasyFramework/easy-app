export interface Permission {
  role: string;
  read: boolean;
  write: boolean;
  create: boolean;
  delete: boolean;
  fields?: {
    [key: string]: {
      read: boolean;
      write: boolean;
    };
  };
  actions?: {
    [key: string]: boolean;
  };
}
