import {test, expect} from '@playwright/test'; //equivalent to C# 'using' statements. Bring in the PW code for us to use.

//Playwright code is asynchronous - executes now, has effects later.
test('hello world', async({page}) => {  //Use modern async/await function syntax to make this easily understandable. Note you cant do this with Cypress and can make some Cypress code difficult to read/write/debug/understand 
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
    //Playwright - you can do the same
    await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill('edgewords');

    //WebDriver - can store element references for use/reuse
    // WebElement passwordField = driver.findElement(By.id("password"));
    // passwordField.sendKeys("edgewords123");

    //In playwright the locator doesnt *actually do* the search
    //The search for the element happens when you try to use it with an action
    //This means less/no StaleElement exceptions
    let passwordField = page.locator('#password'); //No await - we're just storing the 'how to find' not actually finding
    await passwordField.fill('edgewords123'); //Finds the element, then does the action.

    await page.getByRole('link', { name: 'Submit' }).click();

    //Used record at cursor to generate this code
    await page.locator('#name').fill('Steve');
    //await page.fill('#name', 'Steve'); //Old style playwright code - note the action includes the locator and text to type - this is discouraged but still works.
    await page.locator('#username').click();
    await page.getByText('User is Logged in Add Record').click();

    //Assertions recorded with recorder
    //Assertions have a 5s timeout by default
    await expect(page.getByRole('link', { name: 'Submit' })).toBeVisible();
    await expect(page.locator('h1')).toContainText('Add A Record To the Database');
    await expect(page.locator('#name')).toHaveValue('Steve');

});

