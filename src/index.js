const chromium = require('chrome-aws-lambda');

class Credential {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

// for Mac
const getChromeLocalPath = () => {
    if (process.env.PLATFORM === 'Linux') {
        return '/usr/bin/chromium-browser';
    } else {
        return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    }
};
const chromeLocalPath = getChromeLocalPath();

const runPuppeteer =
    async (isLocal = false) => {
        const credential = new Credential(process.env.USER_ID, process.env.PASSWORD);

        const browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath:  chromeLocalPath , //: await chromium.executablePath,
            headless: true,
            ignoreHTTPSErrors: true,
        });
        try {
            const page = await browser.newPage();
            page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36");            
            await page.goto('https://p.eagate.573.jp/game/card_connect/1/omikuji/index.html');

            console.log(await page.title());
            console.log(await page.url());

            const login_link_clicker = async (text) => {
                const linkHandlers = await page.$x(`//*[@id="container"]//a[contains(text(), "${text}")]`);
                if (linkHandlers.length > 0) {
                    await linkHandlers[0].click();
                } else {
                    throw new Error("Link not found");
                }
            };

            await login_link_clicker("ログイン");
            console.log("login clicked");

            await page.waitForTimeout(1000);
            const input_user_id = '#id_userId';
            await page.waitForSelector(input_user_id);
            await page.type(input_user_id, credential.username);
            await page.waitForTimeout(1000);
            const input_password = '#id_password';
            await page.type(input_password, credential.password);
            await page.waitForTimeout(1000);
            await page.click('p.submit');

            const omikuji_wrapper_id = '#omikuji';
            await page.waitForSelector(omikuji_wrapper_id);

            const imgPaths = await page.$x(`//img[contains(@src, 'btn03_off.png')]`);
            if (imgPaths.length != 0) {
                console.log("Come back tomorrow.");
            } else {
                console.log("You have the right to omikuji.");
                await page.evaluate(async () => {
                    const drawImgXPath = `//img[contains(@src, 'btn02_off.png')]`;
                    const nodesSnapshot = document.evaluate(drawImgXPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                    nodesSnapshot.snapshotItem(0).click();
                });
                console.log("clicked...");
            }
        } catch (e) {
            console.error(`error: ${e}`);
        } finally {
            console.log("done");
            await browser.close();
        }
    };


const handler = async (event, context) => {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2));
    await runPuppeteer();
    return "OK";
};

exports.handler = handler;
// for test
exports.runPuppeteer = runPuppeteer;
