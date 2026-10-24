import type { Browser } from "puppeteer-core";
import puppeteer from "puppeteer-core";
import { Logger } from "#lib/server/logger/index.ts";
import { PUPPETEER_EXECUTABLE_PATH } from "$app/env/private";

export class BrowserInstance {
  logger: Logger;
  browser: Browser;

  constructor(logger: Logger, browser: Browser) {
    this.logger = logger;
    this.browser = browser;
  }

  static async start() {
    const logger = new Logger();

    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      executablePath: PUPPETEER_EXECUTABLE_PATH,
    });

    logger.info({ message: "started browser instance", version: await browser.version() });

    return new BrowserInstance(logger, browser);
  }

  async stop() {
    this.logger.warn("stopping browser instance");
    await this.browser.close();
  }

  async renderPdf(html: string): Promise<Uint8Array> {
    const page = await this.browser.newPage();
    await page.setContent(html);
    const pdf = await page.pdf();
    await page.close();
    return pdf;
  }
}
