import {Page, Locator} from '@playwright/test'

class HomePom {


    page: Page
    //If this was webdriver C# it would look like this:
    //WebElement loginLink;
    loginLink: Locator
    
    //If this was C# the constructor would have the same name as the class it is defined in i.e.:
    //public HomePom(WebDriver driver){ ... }
    constructor(page: Page){
        this.page = page;
        //Locators
        this.loginLink = page.getByText('Login To Restricted Area');
    }

    //ServiceMethods
    async goLogin(){await this.loginLink.click();}

}

export {HomePom as HomePom};
