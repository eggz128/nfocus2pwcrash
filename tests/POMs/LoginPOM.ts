import {Page, Locator} from '@playwright/test'

export default class LoginPOM {

    page: Page
    usernameField: Locator
    passwordField: Locator
    //submitFormButton: Locator
    //clearButton = this.page.getByText('Clear');
    constructor(page: Page){
        this.page = page;
        //Locators - normally in constructor as locator properties must be initialised before leaving constructor
        this.usernameField = page.getByRole('row', { name: 'User Name?' }).locator('#username');
        
        this.passwordField = page.locator('#password');
        // this.submitFormButton = page.getByRole('link', { name: 'Submit' })
    }

    //Locators can be outside constructor if using getters
    get submitFormButton() {
        return this.page.getByRole('link', { name: 'Submit' });
    }
    

    //ServiceMethods
    async login(username: string, password: string){
        await this.usernameField.fill(username);
        //await this.page.waitForTimeout(1000); //Demo waits
        await this.passwordField.fill(password);
        //await this.page.waitForTimeout(1000);
        await this.submitFormButton.click();
    }

}
