import type { RemoteQuery } from "@sveltejs/kit";
import { Serializable } from "#lib/serializable.ts";
import type { UserData } from "../utils.ts";
import * as remote from "./index.remote.ts";

export class User extends Serializable<UserData> {
  static getAllAdmin(page: number): RemoteQuery<User[]> {
    return remote.getAllAdmin(page);
  }

  static countAllAdmin(): RemoteQuery<number> {
    return remote.countAllAdmin();
  }
}
