export type Page = "home" | "library" | "not-found";

export const getPageFromPath = (pathname: string): Page => {
  if (pathname === "/" || pathname === "/home") {
    return "home";
  }

  return pathname === "/library" ? "library" : "not-found";
};
