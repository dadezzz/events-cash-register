import type { RemoteQuery } from "@sveltejs/kit";
import { Serializable } from "#lib/serializable.ts";
import type { UserData } from "../data.ts";
import type { UserId } from "../id.ts";
import type { UserPrivilege } from "../index.ts";
import type { UserPaginationOptions } from "../pagination.ts";
import * as remote from "./index.remote.ts";

export class UserClient extends Serializable<UserData> {
  static fromPaginationAdmin(options: UserPaginationOptions): RemoteQuery<UserClient[]> {
    return remote.fromPaginationAdmin(options);
  }

  static countAllAdmin(): RemoteQuery<number> {
    return remote.countAllAdmin();
  }

  static fromIdAdmin(id: UserId): RemoteQuery<UserClient> {
    return remote.fromIdAdmin(id);
  }

  static async fromSelf(): Promise<UserClient | null> {
    return remote.fromSelf();
  }

  getPrivilegesAdmin(): RemoteQuery<UserPrivilege[]> {
    return remote.getPrivilegesAdmin(this.data.id);
  }
}
