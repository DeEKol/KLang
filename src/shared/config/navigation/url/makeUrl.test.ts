import { ENavigation } from "../types/navigation";

import { makeUrl } from "./makeUrl";

describe("makeUrl", () => {
  it("builds login path with next param", () => {
    const url = makeUrl(ENavigation.LOGIN, { next: "profile" });
    expect(url).toBe("myapp://auth/login/profile");
  });

  it("adds query params when not path params", () => {
    const url = makeUrl(ENavigation.PROFILE, { userId: "42", foo: "bar" });
    // PROFILE template is "profile/:userId?" -> path includes userId and query contains foo
    expect(url).toContain("myapp://profile/42");
    expect(url).toContain("?foo=bar");
  });
});
