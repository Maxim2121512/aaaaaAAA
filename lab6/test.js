import { Builder, By, Key, Select, until } from 'selenium-webdriver'

(async function test() {
    let driver = await new Builder().forBrowser('chrome').build();
    const expectedDateString = 'Текущая дата: 2021-12-15';
    const expectedPrice = `Количество средств: ${10000 - 175.11}`
    try {
        await driver.get('http://localhost:5173/login');
        await driver.sleep(5000);
        let selectElement = await driver.findElement(By.id("userSelect"));
        let buttonLogin = await driver.findElement(By.id("loginButton"));
        let select = await new Select(selectElement);;
        await select.selectByVisibleText('Василий');
        await buttonLogin.click();

        await driver.wait(async function () {
            const currentDateElement = await driver.wait(until.elementLocated(By.id('currentDate')));
            const currentDateString = await currentDateElement.getText();
            return currentDateString === expectedDateString;
        }, 100000);

        const buttonElement = await driver.findElement(By.id("buyStockAAPL"));
        const countElement = await driver.findElement(By.id("countBuyAAPL"));

        await countElement.clear();
        await countElement.sendKeys('1');

        buttonElement.click();

        let balanceElem = await driver.findElement(By.id("balance"));
        let balance = await balanceElem.getText();
        console.log(`Ожидаемая цена:${expectedPrice}\tPеальная цена:${balance}`)
        if (expectedPrice !== balance) {
            throw new Error(`Ошибка:\nОжидаемая цена:${expectedPrice}\nРеальная цена:${balance}`);
        }
    } catch (e) {
        console.error(`Ошибка: ${e.message}`);
    } finally {
        await driver.quit()
    }
})();