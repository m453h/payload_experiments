import { loadEnvConfig } from "@next/env";
import express from "express";
import nodemailerSendgrid from "nodemailer-sendgrid";
import payload from "payload";
import type { Payload } from "payload/dist/payload";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const port = parseInt(process.env.PORT || "3000", 10);
const sendGridAPIKey = process.env.SENDGRID_API_KEY;

if (!process.env.NEXT_MANUAL_SIG_HANDLE) {
  process.on("SIGTERM", () => process.exit(0));
  process.on("SIGINT", () => process.exit(0));
}

const app = express();

app.get("/", (_, res) => {
  res.redirect("/admin");
});

const start = async (): Promise<void> => {
  let localPayload: Payload;
  try {
    localPayload = await payload.init({
      ...(sendGridAPIKey
        ? {
            email: {
              transportOptions: nodemailerSendgrid({
                apiKey: sendGridAPIKey,
              }),
              fromName: process.env.SENDGRID_FROM_NAME || "Code for Africa CMS",
              fromAddress:
                process.env.SENDGRID_FROM_EMAIL || "noreply@dodeforafrica.org",
            },
          }
        : undefined),
      secret: process.env.PAYLOAD_SECRET ?? "",
      express: app,
      onInit: (initPayload: { logger: { info: (arg0: string) => void } }) => {
        initPayload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
      },
    });
  } catch (e: any) {
    console.log(e);
    process.exit();
  }
  app.listen(port, async () => {
    localPayload.logger.info(`Payload started`);
  });
};

start();
