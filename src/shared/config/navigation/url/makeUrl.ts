import { ROUTE_PATHS } from "../routes";
import type { TAllStackParamList } from "../types/navigation";

/**
 * Простая helper-функция, которая подставляет path-параметры ( :param? )
 * и сериализует оставшиеся поля в query string.
 *
 * Типы: можно дополнительно привязать к TRootStackParamList (если он экспортирован из места
 * где ты описал типы). Ниже пример, как это сделать.
 */

function replacePathParams(pathTemplate: string, params: Record<string, unknown> = {}) {
  // replace :param or :param? with encoded value or with empty string if not provided (optional)
  const res = pathTemplate.replace(/:([a-zA-Z0-9_]+)\??/g, (_, key) => {
    const val = params[key];
    return val !== undefined && val !== null ? encodeURIComponent(String(val)) : "";
  });
  // cleanup double slashes and trailing slash
  return res.replace(/\/+/g, "/").replace(/\/$/, "");
}

export function makeUrl(route: keyof TAllStackParamList, params?: Record<string, unknown>) {
  const template = ROUTE_PATHS[route as keyof typeof ROUTE_PATHS] as string;
  if (!template) {
    throw new Error(`No path template found for route ${String(route)}`);
  }
  const hasPathParams = /:([a-zA-Z0-9_]+)/.test(template);
  const path = hasPathParams ? replacePathParams(template, params || {}) : template;

  // remove path keys from params to build query string
  const usedKeys = (template.match(/:([a-zA-Z0-9_]+)\??/g) || []).map((k) =>
    k.replace(/[:?]/g, ""),
  );
  const extra: Record<string, unknown> = {};
  if (params) {
    Object.keys(params).forEach((k) => {
      if (!usedKeys.includes(k)) extra[k] = params[k];
    });
  }
  const qs =
    Object.keys(extra).length > 0
      ? "?" +
        Object.entries(extra)
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
          .join("&")
      : "";

  // return url with your scheme; change prefix if needed
  return `myapp://${path}${qs}`;
}

/**
 * === Optional: Strongly typed version ===
 * If you export TRootStackParamList from your navigation types file, you can do:
 *
 * import type { TRootStackParamList } from 'shared/navigation/types';
 *
 * export function makeUrlTyped<Route extends keyof TRootStackParamList>(
 *   route: Route,
 *   params?: TRootStackParamList[Route]
 * ) {
 *   return makeUrl(route as ENavigation, params as any);
 * }
 *
 * This way TypeScript will check params shape against your TRootStackParamList.
 */
