import "./footer.scss";
import logoIcon from "../../assets/icons/logo.svg";
import shareIcon from "../../assets/icons/share.svg";
import chatIcon from "../../assets/icons/chat.svg";
import rssIcon from "../../assets/icons/rss_feed.svg";
import rsLogoIcon from "../../assets/icons/rs-logo.svg";

interface FooterNavigationGroup {
  readonly title: string;
  readonly items: readonly string[];
}

interface SocialLink {
  readonly label: string;
  readonly icon: string;
}

const navigationGroups: readonly FooterNavigationGroup[] = [
  {
    title: "Explore",
    items: ["Home", "Library", "Categories", "Tournaments"],
  },
  {
    title: "Company",
    items: ["About Us", "Contact", "Privacy Policy", "Terms of Service"],
  },
];

const socialLinks: readonly SocialLink[] = [
  { label: "Share", icon: shareIcon },
  { label: "Community", icon: chatIcon },
  { label: "RSS feed", icon: rssIcon },
];

const createNavigationGroup = (
  group: FooterNavigationGroup,
  index: number,
): HTMLElement => {
  const navigation = document.createElement("nav");
  const title = document.createElement("h2");
  const list = document.createElement("ul");

  const titleId = `footer-navigation-title-${index + 1}`;

  navigation.className = "footer__navigation";
  title.className = "footer__navigation-title";
  list.className = "footer__navigation-list";

  title.id = titleId;
  title.textContent = group.title;
  navigation.setAttribute("aria-labelledby", titleId);

  for (const item of group.items) {
    const listItem = document.createElement("li");
    const link = document.createElement("a");

    listItem.className = "footer__navigation-item";
    link.className = "footer__navigation-link";
    link.href = "./";
    link.textContent = item;

    listItem.append(link);
    list.append(listItem);
  }

  navigation.append(title, list);

  return navigation;
};

const createSocialNavigation = (): HTMLElement => {
  const navigation = document.createElement("nav");
  const title = document.createElement("h2");
  const list = document.createElement("ul");

  navigation.className = "footer__socials";
  title.className = "footer__navigation-title";
  list.className = "footer__social-list";

  title.id = "footer-social-title";
  title.textContent = "Community";
  navigation.setAttribute("aria-labelledby", title.id);

  for (const { label, icon: iconSource } of socialLinks) {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    const icon = document.createElement("img");
    const accessibleLabel = document.createElement("span");

    listItem.className = "footer__social-item";
    link.className = "footer__social-link";
    icon.className = "footer__social-icon";
    accessibleLabel.className = "footer__visually-hidden";

    link.href = "./";
    icon.src = iconSource;
    icon.alt = "";
    accessibleLabel.textContent = label;
    icon.setAttribute("aria-hidden", "true");

    link.append(icon, accessibleLabel);
    listItem.append(link);
    list.append(listItem);
  }

  navigation.append(title, list);

  return navigation;
};

export const createFooter = (): HTMLElement => {
  const footer = document.createElement("footer");
  const container = document.createElement("div");
  const content = document.createElement("div");
  const brand = document.createElement("div");
  const logo = document.createElement("a");
  const logoImage = document.createElement("img");
  const logoText = document.createElement("span");
  const description = document.createElement("p");
  const navigation = document.createElement("div");
  const bottom = document.createElement("div");

  const copyright = document.createElement("p");
  const courseLink = document.createElement("a");
  const rsLogo = document.createElement("img");
  const courseText = document.createElement("span");
  const githubLink = document.createElement("a");
  const githubIcon = document.createElement("span");
  const githubText = document.createElement("span");
  const designedText = document.createElement("p");

  footer.className = "footer";
  container.className = "footer__container";
  content.className = "footer__content";
  brand.className = "footer__brand";
  logo.className = "footer__logo";
  logoImage.className = "footer__logo-icon";
  logoText.className = "footer__logo-text";
  description.className = "footer__description";
  navigation.className = "footer__navigation-groups";
  bottom.className = "footer__bottom";

  copyright.className = "footer__copyright";
  courseLink.className = "footer__credit-link";
  rsLogo.className = "footer__rs-logo";
  githubLink.className = "footer__credit-link";
  githubIcon.className = "footer__github-icon";
  designedText.className = "footer__designed";

  logo.href = "./";
  logoImage.src = logoIcon;
  logoImage.alt = "";
  logoText.textContent = "MiniGames";
  description.textContent =
    "Take a short break and have fun. Hundreds of curated casual mini-games right in your web browser. No download required.";

  for (const [index, group] of navigationGroups.entries()) {
    navigation.append(createNavigationGroup(group, index));
  }

  navigation.append(createSocialNavigation());

  copyright.textContent = "© 2026 MiniGames. All rights reserved.";

  courseLink.href = "https://rs.school/courses/short-track";
  courseLink.target = "_blank";
  courseLink.rel = "noreferrer";
  rsLogo.src = rsLogoIcon;
  rsLogo.alt = "";
  courseText.textContent = "RS School";

  githubLink.href = "https://github.com/voarix";
  githubLink.target = "_blank";
  githubLink.rel = "noreferrer";
  githubIcon.textContent = "< >";
  githubIcon.setAttribute("aria-hidden", "true");
  githubText.textContent = "@voarix";

  designedText.textContent = "Designed with love";

  courseLink.append(rsLogo, courseText);
  githubLink.append(githubIcon, githubText);
  bottom.append(copyright, courseLink, githubLink, designedText);

  logo.append(logoImage, logoText);
  brand.append(logo, description);
  content.append(brand, navigation);
  container.append(content, bottom);
  footer.append(container);

  return footer;
};
