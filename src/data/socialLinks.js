import { personal } from "./personal";

export const socialLinks = [
  {
    name: "GitHub",
    url: personal.github,
    icon: "Github",
  },
  {
    name: "LinkedIn",
    url: personal.linkedin,
    icon: "Linkedin",
  },
  {
    name: "Instagram",
    url: personal.instagram,
    icon: "Instagram",
  },
  {
    name: "Phone",
    url: `tel:${personal.phone}`,
    icon: "Phone",
  },
  {
    name: "Email",
    url: `mailto:${personal.email}`,
    icon: "Mail",
  },
];

export const linkedinPosts = [
  {
    id: "post1",
    embedUrl:
      "https://www.linkedin.com/embed/feed/update/urn:li:share:7509694639566721024",
    postUrl:
      "https://www.linkedin.com/feed/update/urn:li:share:7509694639566721024",
    height: 598,
  },
  {
    id: "post2",
    embedUrl:
      "https://www.linkedin.com/embed/feed/update/urn:li:share:7507404292677496832",
    postUrl:
      "https://www.linkedin.com/feed/update/urn:li:share:7507404292677496832",
    height: 600,
  },
];
