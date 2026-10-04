export interface UserPrivilegeMetadata {
  readableName: string;
}

export const userPrivilegesMetadata = {
  ADMIN: {
    readableName: "Amministratore",
  },
};

export type UserPrivilege = keyof typeof userPrivilegesMetadata;
