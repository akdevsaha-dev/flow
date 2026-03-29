import type { Request, Response } from 'express';
import type { CookieOptions } from 'express';

export const cookies = {
  getOptions: (): CookieOptions => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  }),

  set: (
    res: Response,
    name: string,
    value: string,
    options: CookieOptions = {}
  ) => {
    res.cookie(name, value, { ...cookies.getOptions(), ...options });
  },

  get: (req: Request, name: string) => {
    return req.cookies[name];
  },

  /** Parse a single cookie value from a raw `Cookie` header (e.g. WebSocket upgrade requests). */
  getFromHeader: (cookieHeader: string | undefined, name: string): string | undefined => {
    if (!cookieHeader) return undefined;
    const parts = cookieHeader.split(';');
    for (const part of parts) {
      const trimmed = part.trim();
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      if (key !== name) continue;
      return trimmed.slice(eqIdx + 1).trim();
    }
    return undefined;
  },

  clear: (res: Response, name: string, options: CookieOptions = {}) => {
    const { maxAge: _, ...rest } = cookies.getOptions();
    res.clearCookie(name, { ...rest, ...options });
  },
};
