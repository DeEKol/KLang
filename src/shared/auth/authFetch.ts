import { sessionService } from "./sessionService";

export async function authFetch(url: string, opts: RequestInit = {}) {
  const attachToken = async () => {
    let token = await sessionService.getAccessToken();

    if (!token) token = await sessionService.refreshAccessTokenIfNeeded();

    const headers = opts.headers ? new Headers(opts.headers) : new Headers();

    if (token) headers.set("Authorization", `Bearer ${token}`);

    return { ...opts, headers };
  };

  let reqOpts = await attachToken();
  let res = await fetch(url, reqOpts);

  if (res.status === 401) {
    // * try refresh once
    const newToken = await sessionService.refreshAccessTokenIfNeeded();

    if (!newToken) {
      // * can't refresh -> return original 401 (caller may sign out)
      return res;
    }

    // * retry request with new token
    reqOpts = { ...opts, headers: opts.headers ? new Headers(opts.headers) : new Headers() };

    reqOpts.headers.set("Authorization", `Bearer ${newToken}`);

    res = await fetch(url, reqOpts);
  }

  return res;
}
