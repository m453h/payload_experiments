import type { CollectionConfig } from "payload/types";

import richText from "../../fields/richText";
import { tenant } from "../../fields/tenant";
import { loggedIn } from "./access/loggedIn";
import { tenantAdmins } from "./access/tenantAdmins";
import { tenants } from "./access/tenants";
import formatSlug from "./hooks/formatSlug";
import { PageHeader } from "../../blocks/roboshield/PageHeader";
import { Content } from "../../blocks/roboshield/Content";
import { PageHero } from "../../blocks/roboshield/PageHero";
import RoboForm from "../../blocks/roboshield/RoboForm";
import { Statistics } from "../../blocks/roboshield/Statistics";
import { canViewBlockField } from "../../utilities/canViewBlockField";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "updatedAt"],
  },
  access: {
    read: tenants,
    create: loggedIn,
    update: tenantAdmins,
    delete: tenantAdmins,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      index: true,
      admin: {
        position: "sidebar",
      },
      hooks: {
        beforeValidate: [formatSlug("title")],
      },
    },
    {
      name: "RoboshieldBlocks",
      label: "RoboShield Blocks",
      type: "blocks",
      blocks: [PageHeader, PageHero, Content, Statistics, RoboForm],
      localized: true,
      admin: {
        initCollapsed: true,
        condition: (_data, _siblingData, { user }) => {
          console.log(user);
          return canViewBlockField("RoboShield", user);
        },
      },
    },
    {
      name: "cfaBlocks",
      label: "Code for Africa Blocks",
      type: "blocks",
      blocks: [PageHeader, PageHero, Content, Statistics, RoboForm],
      localized: true,
      admin: {
        initCollapsed: true,
        condition: (_data, _siblingData, { user }) => {
          console.log(user);
          return canViewBlockField("CfA", user);
        },
      },
    },
    tenant,
    richText(),
  ],
};
