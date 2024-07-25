import type { User } from "../payload-types";
import { PageHeader } from "../blocks/roboshield/PageHeader";
import { Content } from "../blocks/roboshield/Content";
import { PageHero } from "../blocks/roboshield/PageHero";
import RoboForm from "../blocks/roboshield/RoboForm";
import { Statistics } from "../blocks/roboshield/Statistics";
import JoinOurSlack from "../blocks/codeforafrica/JoinOurSlack";

export const getTenantBlocks = (user: User = undefined) => {
  if (user) {
    return [];
  }

  return [PageHeader, PageHero, Content, Statistics, RoboForm, JoinOurSlack];
};
