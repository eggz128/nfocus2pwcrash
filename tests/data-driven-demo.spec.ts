import { test, expect } from '@playwright/test';
import { HomePom }  from './POMs/HomePOM'
import LoginPOM from './POMs/LoginPOM';
import AddRecordPOM from './POMs/AddRecordPOM';
import data from './test-data/logins.json';

for (let credentials of data) {
    test(`Data driving username and password combos: ${credentials.username}`, async({page})=>{
        await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
        const home = new HomePom(page);
        await home.goLogin();
        const loginPage = new LoginPOM(page);
        await loginPage.login(credentials.username,credentials.password);

        const addrecordPage = new AddRecordPOM(page);
        
        await addrecordPage.loadComplete();//ensure we have landed on the right page
        expect(await addrecordPage.getBodyText()).toContain('User is Logged in'); //Wont retry - lets hope we're on the right page
        
      
        
      });
}

