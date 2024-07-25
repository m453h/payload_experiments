import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import { s3Adapter } from "@payloadcms/plugin-cloud-storage/s3";
import nestedDocs from "@payloadcms/plugin-nested-docs";
import seo from "@payloadcms/plugin-seo";
import { slateEditor } from "@payloadcms/richtext-slate";
import dotenv from "dotenv";
import { buildConfig } from "payload/config";
import type { CollectionConfig, GlobalConfig } from "payload/types";

import Media from "./collections/Media";
import { Pages } from "./collections/Pages/";
import { Tenants } from "./collections/Tenants";
import { Users } from "./collections/Users";
import { defaultLocale, locales } from "./utilities/locales";
import Site from "./globals/Site";

dotenv.config();
dotenv.config({ path: "./.env.local" });

const appURL = process?.env?.PAYLOAD_PUBLIC_APP_URL;

const cors =
  process?.env?.PAYLOAD_CORS?.split(",")
    ?.map((d) => d.trim())
    ?.filter(Boolean) ?? [];

const csrf =
  process?.env?.PAYLOAD_CSRF?.split(",")
    ?.map((d) => d.trim())
    ?.filter(Boolean) ?? [];

const adapter = s3Adapter({
  config: {
    region: process?.env?.S3_REGION,
    credentials: {
      accessKeyId: process?.env?.S3_ACCESS_KEY_ID,
      secretAccessKey: process?.env?.S3_SECRET_ACCESS_KEY,
    },
  },
  bucket: process?.env?.S3_BUCKET,
} as any);

export default buildConfig({
  serverURL: appURL,
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGO_URL ?? false,
    migrationDir: process.env.MIGRATIONS_DIR,
  }),
  globals: [Site] as GlobalConfig[],
  collections: [Users, Tenants, Pages, Media] as CollectionConfig[],
  ...(locales?.length
    ? {
        localization: {
          locales,
          defaultLocale,
          fallback: true,
        },
      }
    : undefined),
  admin: {
    user: Users.slug,
    webpack: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        fallback: {
          ...config?.resolve?.fallback,
          fs: false,
          os: false,
          "process/browser": false,
        },
      },
    }),
    bundler: webpackBundler(),
  },
  cors,
  csrf,
  i18n: {
    fallbackLng: "en", // default
    debug: false, // default
    resources: {
      en: {
        "codeforafrica.validation": {
          uniquePlatforms: "Please select a unique platform",
        },
      },
    },
  },
  plugins: [
    cloudStorage({
      collections: {
        media: {
          adapter,
          prefix: "media",
        },
      },
    }),
    seo({
      collections: ["pages", "posts"],
      globals: [],
      uploadsCollection: "media",
      generateTitle: ({ doc }: any) => doc?.title?.value as string,
      generateURL: ({ doc }: any) =>
        doc?.slug?.value ? `${appURL}/${doc.slug.value}` : undefined,
    } as any),
    nestedDocs({
      collections: ["pages"],
      generateLabel: (_, doc) => doc.title as string,
      generateURL: (docs) =>
        docs.reduce((url, doc) => `${url}/${doc.slug}`, ""),
    }),
  ] as any[],
  telemetry: process?.env?.NODE_ENV !== "production",
});
