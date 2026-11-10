import session from "express-session";
import { pool } from "./db.js";

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 1 día

/** Almacén de sesiones en MySQL (la memoria por defecto no sirve en producción). */
export class MySQLSessionStore extends session.Store {
  constructor() {
    super();
    // Limpieza de sesiones vencidas cada hora
    this.cleaner = setInterval(() => {
      pool.execute("DELETE FROM sesion WHERE expires_at < NOW()").catch(() => {});
    }, 60 * 60 * 1000);
    this.cleaner.unref();
  }

  #expiry(sess) {
    const expires = sess?.cookie?.expires
      ? new Date(sess.cookie.expires)
      : new Date(Date.now() + DEFAULT_TTL_MS);
    return expires;
  }

  get(sid, cb) {
    pool
      .execute("SELECT data FROM sesion WHERE sid = ? AND expires_at > NOW()", [sid])
      .then(([rows]) => cb(null, rows[0] ? JSON.parse(rows[0].data) : null))
      .catch(cb);
  }

  set(sid, sess, cb) {
    pool
      .execute(
        `INSERT INTO sesion (sid, data, expires_at) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE data = VALUES(data), expires_at = VALUES(expires_at)`,
        [sid, JSON.stringify(sess), this.#expiry(sess)]
      )
      .then(() => cb?.(null))
      .catch((e) => cb?.(e));
  }

  touch(sid, sess, cb) {
    pool
      .execute("UPDATE sesion SET expires_at = ? WHERE sid = ?", [this.#expiry(sess), sid])
      .then(() => cb?.(null))
      .catch((e) => cb?.(e));
  }

  destroy(sid, cb) {
    pool
      .execute("DELETE FROM sesion WHERE sid = ?", [sid])
      .then(() => cb?.(null))
      .catch((e) => cb?.(e));
  }
}
