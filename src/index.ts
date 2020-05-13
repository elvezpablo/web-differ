import { launch } from "puppeteer";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { readFileSync, writeFileSync } from "fs";

const takeScreenshot = async (url: string, fileName: string) => {
  const browser = await launch();
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle0",
  });

  await page.screenshot({ path: `./screenshots/${fileName}_0.png` });

  await browser.close();
};

const login = () => {
  // login and store cookies or grab cookies and try to use them
  // see https://help.apify.com/en/articles/1640711-how-to-log-in-to-a-website-using-puppeteer
};

const compare = (fileName) => {
  const img1 = PNG.sync.read(readFileSync(`./screenshots/${fileName}_0.png`));
  const img2 = PNG.sync.read(readFileSync(`./screenshots/${fileName}_1.png`));
  const { width, height } = img1;
  const diff = new PNG({ width, height });

  pixelmatch(img1.data, img2.data, diff.data, width, height, {
    threshold: 0.1,
  });

  writeFileSync("./screenshots/diff.png", PNG.sync.write(diff));
};

const formatOutput = () => {};

const init = async () => {
  const url = "https://www.reddit.com/r/gifs";
  const fileName = "example";

  //   takeScreenshot(url, fileName);
  compare(fileName);
};

init();
