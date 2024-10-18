import {Page, Locator} from '@playwright/test'

export default class AddRecordPOM {

    page: Page
    #bodyTextLocator: Locator //# = private. So like C# private WebElement bodyTextLocator;
    publicBodyTextLocator: Locator

    constructor(page: Page){
        this.page = page;
        //Locators
        //this.#bodyTextLocator = this.page.locator('body');
        this.#bodyTextLocator = this.page.locator('body');
        this.publicBodyTextLocator = this.page.locator('body');
        //In C# Webdriver we could wait for the page to have loaded by watching the URL
        // However in JS we can't call async function in constructor. This wont work:
        //(async () => {await this.loadComplete();})();

        //It's a bit ugly but call loadComplete() from the test
        //If that's just too ugly, there are other options:
        //https://dev.to/somedood/the-proper-way-to-write-async-constructors-in-javascript-1o8c
        //This current solution is esssentially Option 2 from the link

    }
    //Wait for page load
    async loadComplete(){
        await this.page.waitForURL(/.*\/add_record\.php/);
    }
    //ServiceMethods
    async getBodyText(){
        console.log("Page URL when called : " + await this.page.url());
        const bodyText: string =  await this.#bodyTextLocator.textContent() ?? "";
        return bodyText;
    }

}