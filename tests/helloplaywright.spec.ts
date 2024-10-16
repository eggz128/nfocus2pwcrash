import {test, expect} from '@playwright/test';

test('hello world', async({page}) => {
    //test goes here
    //Webdriver drive.get(url)
    await page.goto("https://www.edgewordstraining.co.uk/webdriver2/");
    
    //browser-find me an element-then click it
    //WebDriver
    //driver.FindElement(By.CssSelector("a")).Click()

    //Playwright
    //browser-find me something-do something with it
    //await page.locator("a").click(); //Doesnt work as matches 2 items
    await page.getByRole('link', { name: 'Login To Restricted Area' }).click();

    //Webdriver - you can chain FindElement lookups to 'drill in' to find child elements
    //PLaywright - you can do the same
    await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill('edgewords');

    //WebDriver
    // WebElement passwordField = driver.findElement(By.id("password"));
    // passwordField.sendKeys("edgewords123");

    //In playwright the locator doesnt actually do the search
    //The search for the element happens when you try to use it
    //This means less/no StaleElement exceptions
    let passwordField = page.locator('#password');
    await passwordField.fill('edgewords123');

    await page.getByRole('link', { name: 'Submit' }).click();

    //Used record at cursor
    await page.locator('#name').fill('Steve');
    await page.locator('#username').click();
    await page.getByText('User is Logged in Add Record').click();
    //Assertions recorded with recorder
    //Assertions have a 5s timeout by default
    await expect(page.getByRole('link', { name: 'Submit' })).toBeVisible();
    await expect(page.locator('h1')).toContainText('Add A Record To the Database');
    await expect(page.locator('#name')).toHaveValue('Steve');

});

