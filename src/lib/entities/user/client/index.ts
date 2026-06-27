import type { RemoteQuery } from "@sveltejs/kit";
import type { PaginationOptions } from "#lib/pagination.ts";
import { Serializable } from "#lib/serializable.ts";
import type { UserData } from "../data.ts";
import type { UserId, UserPrivilege } from "../id.ts";
import type { PaginationSortColumn } from "../pagination.ts";
import * as remote from "./index.remote.ts";

export class User extends Serializable<UserData> {
  static getAllAdmin(options: PaginationOptions<PaginationSortColumn>): RemoteQuery<User[]> {
    return remote.getAllAdmin(options);
  }

  static countAllAdmin(): RemoteQuery<number> {
    return remote.countAllAdmin();
  }

  static getUserAdmin(id: UserId): RemoteQuery<User> {
    return remote.getUserAdmin(id);
  }

  getPrivilegesAdmin(): RemoteQuery<UserPrivilege[]> {
    return remote.getPrivilegesAdmin(this.data.id);
  }
}
