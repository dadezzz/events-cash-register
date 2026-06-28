import { and, eq } from "drizzle-orm";
import { getFirstOptional, getFirstOrThrow } from "#lib/array.ts";
import { User } from "#lib/entities/user/index.ts";
import { db, s } from "#lib/server/database/index.ts";
import { generateRandomString } from "#lib/server/random.ts";
import { deleteCookie, getCookie, setCookie } from "#lib/server/request/cookie.ts";
import { getRequestClientIp, getRequestHeader, getRequestHeadersHash } from "#lib/server/request/index.ts";
import { SESSION_COOKIE_NAME, SESSION_EXPIRE_AFTER, SESSION_RENOVATE_AFTER } from "$app/env/private";
import { headersToHash, type SessionId, type SessionIdHash, sqlSessionNotExpired } from "./utils.ts";

export class Session {
  readonly id: SessionId;
  readonly user: User;

  constructor(id: SessionId, user: User) {
    this.id = id;
    this.user = user;
  }

  /**
   * Gets the session from the current request and rotates it if it's about to
   * expire.
   *
   * @returns The session, if found.
   */
  static async fromCookie(): Promise<Session | null> {
    const secret = getCookie(SESSION_COOKIE_NAME);
    if (!secret) {
      return null;
    }

    const session = await Session.fromSecret(secret);

    if (session instanceof NewSession) {
      session.setCookie();
    }

    // If a cookie was found, but the session expired, delete it to avoid
    // expensive database checks until the user signs in again.
    if (secret && !session) {
      deleteCookie(SESSION_COOKIE_NAME);
    }

    return session;
  }

  /**
   * Validates that the session is still valid and if needed rotates it.
   *
   * @param secret Id sent by the client.
   * @returns A Session if found and a NewSession if it was rotated.
   */
  private static async fromSecret(secret: string): Promise<Session | NewSession | null> {
    const hashedSecret = getRequestHeadersHash(secret, headersToHash) as SessionIdHash;

    const r = await db
      .update(s.session)
      .set({ ip: getRequestClientIp(), lastUsedAt: new Date() })
      .where(and(sqlSessionNotExpired, eq(s.session.hashedSecret, hashedSecret)))
      .returning({ id: s.session.id, renovatedAt: s.session.renovatedAt, userId: s.session.userId })
      .then(getFirstOptional);

    if (!r) {
      return null;
    }

    const { id, userId, renovatedAt } = r;
    const session = new Session(id, new User(userId));

    // If the session hasn't been renovated after SESSION_RENOVATE_AFTER
    // milliseconds and before SESSION_EXPIRE_AFTER milliseconds, then we rotate
    // the id to maintain it active.
    if (renovatedAt < new Date(Date.now() - SESSION_RENOVATE_AFTER.asMilliseconds())) {
      return await session.rotate();
    }

    return session;
  }

  /**
   * Rotates the session idHash and resets its renovation time.
   */
  private async rotate(): Promise<NewSession> {
    const secret = generateRandomString();
    const hashedSecret = getRequestHeadersHash(secret, headersToHash) as SessionIdHash;

    await db.update(s.session).set({ hashedSecret, renovatedAt: new Date() }).where(eq(s.session.id, this.id));

    return new NewSession(this.id, this.user, secret);
  }

  /**
   * Deletes the session cookie and then deletes the session from the database.
   */
  async deleteCookie(): Promise<void> {
    // Delete the cookie so that we can avoid checking the nonexistent token in
    // the database on the next requests. This makes the website faster for users
    // who logged out.
    // We delete it before than the database session so that if that fails, to the
    // user it will still seem like they were logged out.
    deleteCookie(SESSION_COOKIE_NAME);
    await this.delete();
  }

  /**
   * Deletes the session from the database.
   */
  async delete(): Promise<void> {
    await db.delete(s.session).where(eq(s.session.id, this.id));
  }
}

// Basically Session but we know the non-hashed id.
export class NewSession extends Session {
  private readonly secret: string;

  constructor(id: SessionId, user: User, secret: string) {
    super(id, user);
    this.secret = secret;
  }

  /**
   * Creates a new session and sets the cookie to its id.
   */
  static async create(user: User): Promise<NewSession> {
    const secret = generateRandomString();
    const hashedSecret = getRequestHeadersHash(secret, headersToHash) as SessionIdHash;

    const id = await db
      .insert(s.session)
      .values({
        hashedSecret,
        userId: user.id,
        userAgent: getRequestHeader("user-agent") ?? "",
        ip: getRequestClientIp(),
      })
      .returning({ id: s.session.id })
      .then(getFirstOrThrow)
      .then((r) => r.id);

    return new NewSession(id, user, secret);
  }

  /**
   * Sets the session cookie in the set of cookies that the client will send on
   * each request.
   */
  setCookie() {
    setCookie(SESSION_COOKIE_NAME, this.secret, SESSION_EXPIRE_AFTER);
  }
}
