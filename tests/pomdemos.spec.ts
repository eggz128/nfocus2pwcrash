import { test, expect } from '@playwright/test';
import { HomePom } from './POMs/HomePOM'
import LoginPOM from './POMs/LoginPOM';
import AddRecordPOM from './POMs/AddRecordPOM';

test('Traditional test', async ({ page }) => {
    await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
    await page.getByRole('link', { name: 'Login To Restricted Area' }).click();
    await page.getByRole('row', { name: 'User Name?' }).locator('#username').click();
    await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill('edgewords');
    await page.locator('#password').click();
    await page.locator('#password').fill('edgewords123');
    await page.getByRole('link', { name: 'Submit' }).click();
    await expect(page.locator('body')).toContainText('User is Logged in');
    await page.getByRole('link', { name: 'Log Out' }).click();
    //Todo: add code to deal with JS confirm prompt
    await expect(page.locator('body')).toContainText('User is not Logged in');
});

test('Using the POM', async ({ page }) => {
    await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
    const home = new HomePom(page);
    await home.goLogin();
    const loginPage = new LoginPOM(page);
    await loginPage.login('edgewords', 'edgewords123');

    const addrecordPage = new AddRecordPOM(page);

    await addrecordPage.loadComplete(); //This is a bit ungly but enures we have navigated away from login page before  checking the text
    const returnedText = await addrecordPage.getBodyText();
    expect(returnedText).toContain('User is Logged in');

    //Alternatively, leave the body text locator public and use it directly in the assertion
    await expect(addrecordPage.publicBodyTextLocator).toContainText('User is Logged in'); //This should retry

    //Abusing the locator to navigate around the DOM
    //await addrecordPage.publicBodyTextLocator.locator('xpath=../../..').click();

});
