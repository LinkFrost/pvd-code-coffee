/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: [
      "secure.meetupstatic.com",
      "media.licdn.com",
      "k3ss83nfoe.ufs.sh",
    ],
  },
};

export default config;
