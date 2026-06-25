import type { User } from "./index.ts";

export class Operator {
  user: User;

  constructor(user: User) {
    this.user = user;
  }
}
