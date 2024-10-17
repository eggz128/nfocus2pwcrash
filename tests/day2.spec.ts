import { test, expect } from '@playwright/test';

test('add a cap to the cart', async ({ page }) => {
  
  await page.goto('https://www.edgewordstraining.co.uk/demo-site/');
  //await page.getByLabel("Search for:").click();

  await page.getByRole('searchbox', { name: 'Search for:' }).click(); //name: value is not an exact match by default. It's treated more like a substring match. So you could delete "for:" and this would still work.
  await page.getByRole('searchbox', { name: /Search.*/ }).fill('cap'); //You can also use regex
  await page.getByRole('searchbox', { name: 'Search', exact: true}).press('Enter'); //If you want an exact match set the exact: property to true. This line will fail.
  
});

test('all products', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/demo-site/');
  const newProducts = page.getByLabel('Recent Products');
  for (const prod of await newProducts.locator('h2:not(.section-title)').all()) {
    console.log(await prod.textContent());
  };
});

test('test', async ({ page }) => {

  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
  await page.getByText('Login To Restricted Area').click();
  
  const username = await page.getByRole('row', { name: 'User Name?' }) //You can capture a locator reference. Note this is not an element as such, but rather how to find the element.
  await username.locator('#username').click(); //So when you use the reference a new search is performed. WebDrivers StaleElement exceptions are not a problem for Playwright.
  //await username.locator('#username').fill('edgewords');
  await username.locator('#username').pressSequentially('edgewords', {delay: 1000}); //Method used to be called pressSequence()?

  await page.locator('#password').click();
  await page.locator('#password').fill('edgewords123');

  //await page.getByRole('link', { name: 'Submit' }).click();

  //PLaywright adds lots of extensions to CSS. e.g.
  //Relative location searches :left-of()
  //Inner text queries :text("Sometext")
  //Restart a new search with the results of the last one >>
  // if there are multiple matches pick the 1st, 2nd etc (0 indexed) nth=2
  // Is the element visible :visible
  //await page.locator('a:left-of(:text("Clear")):below(:text("Password?")) >> nth=2').click();
  await page.locator('a:left-of(:text("Clear")):below(:text("Password?")):visible') //If thre are multiple matches, PW wont just use the first. You must ensure there is only 1 before performing an action.
        .filter({hasText: 'Submit'}) //One option is to filter the maultiple matches down.
        .click();

  await page.getByRole('link', { name: 'Log Out' }).click();
  //ToDo: handle the JS confirm alert as the recorder didn't do this

  //Generally dont capture things from the page first then assert on them.
  //Instead pass the locator for the thing to capture to expect, then chain your assertion
  //await expect(page.locator('body')).toContainText('User is not Logged in');

});


test('Locator Handler', async ({ page }) => {
  // Setup the handler.
  const cookieConsent = page.getByRole('heading', { name: 'Hej! You are in control of your cookies.' });
  await page.addLocatorHandler(
    cookieConsent, //Locator to watch out for
    async () => { //If spotted, what to do
      await page.getByRole('button', { name: 'Accept all' }).click();
    }
    , //Optional arguments - can be omitted
    {
      times: 3, //How many times the locator may appear before the handler should stop handling the locator
      //By default Playwright will wait for the locator to no longer be visible before continuing with the test.
      noWaitAfter: true //this can be overridden however
    }
  );

  // Now write the test as usual. If at any time the cookie consent form is shown it will be accepted.
  await page.goto('https://www.ikea.com/');
  await page.getByRole('link', { name: 'Collection of blue and white' }).click();
  await expect(page.getByRole('heading', { name: 'Light and easy' })).toBeVisible();

  //If you're confident the locator will no longer be found you can de-register the handler
  await page.removeLocatorHandler(cookieConsent);
  //If the cookie consent form appears from here on it may cause issues with the test...

})

test("Dragdrop demo", async ({page}) => {
  await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/cssXPath.html");
  await page.locator('#apple').scrollIntoViewIfNeeded(); //force scroll to the apple. Not because Playwright needs it, but because we want to see it.

  await page.dragAndDrop('#slider a', '#slider a', {targetPosition:{x:100,y:0}, force: true }); //Dont do actionability checks because that will fail as soon as the mouse leaves the "gripper" []
  //Large movements may not work for *this* site. So do small jumps - but big enough to "escape" the gripper []
  // await page.dragAndDrop('#slider a', '#slider a', {targetPosition:{x:30,y:0},force: true} );
  // await page.dragAndDrop('#slider a', '#slider a', {targetPosition:{x:30,y:0},force: true} );
  // await page.dragAndDrop('#slider a', '#slider a', {targetPosition:{x:30,y:0},force: true} );
  // await page.dragAndDrop('#slider a', '#slider a', {targetPosition:{x:30,y:0},force: true} );
  await page.waitForTimeout(2000) //Dumb 2 second wait for us to confirm the above worked.
})

test("Assertion demos @tag1", { tag: ['@smoke','@regression'], annotation: {type:'issue', description: 'This is a description'}},async ({page, browserName})=>{
  //test.skip(browserName === 'chromium', 'skipping on chromium')
  await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html");
  await page.locator('#textInput').fill("Hello world");
  await page.locator('#checkbox').check();
  const heading = page.locator('#right-column > h1');
  
  const slowExpect = expect.configure({timeout: 10000});
  
  await expect(heading).toContainText("For");
  //await expect(heading).toHaveText("For", {timeout: 10000}); //Override default assertion timeout of 5s with 10s (10000ms)
  //
  //await slowExpect.soft(heading).toHaveText("For"); //Fails as "For" is not the exact text
  await slowExpect.soft(heading).toHaveText(/For.*/); //Passes using this RegEx
  
  await page.pause();

  //await expect(page.locator('#checkbox')).not.toBeChecked(); //Negate assertions with .not


  //Image validation
  //1st run will capture browser and os specific images
  //2nd run will compare against previously captured images.

  // await expect.soft(page).toHaveScreenshot('wholepage.png');
  // await expect(page.locator('#textInput')).toHaveScreenshot('textbox.png', {
  //     maxDiffPixels: 122,
  //     maxDiffPixelRatio: 0.1,
  //     threshold: 0.1,
  // });



  let rightColText = await page.locator('#right-column').textContent(); //Includes whitespace in HTML file

  console.log("The right column text is with textContent is: " + rightColText);

  rightColText = await page.locator('#right-column').innerText(); //Captures text after browser layout has happened (eliminating most whitespace)

  console.log("The right column text is with innertext is: " + rightColText);

  let textBoxText: string = await page.locator('#textInput').textContent() ?? "" ; //TS: if textContent() returns null, retuen empty string "" instead
  console.log("The text box contains" + textBoxText); //blank as <input> has no inner text

  //Using generic $eval to get the browser to return the INPUT text
  //This will *not* retry or wait
  textBoxText = await page.$eval('#textInput', (el: HTMLInputElement) => el.value); //el is an in browser HTML element - not a Playwright object at all.
  console.log("The text box actually contains: " + textBoxText);

  expect(textBoxText).toBe("Hello world");


})

test("Generic methods", async ({page}) => {
  
  await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html")

  const menuLinks = await page.$$eval('#menu a', (links) => links.map((link) => link.textContent))
  console.log(`There are ${menuLinks.length} links`)

  console.log("The link texts are:")

  for(const iterator of menuLinks){
      console.log(iterator?.trim())
  }
  
  //Prefferred - using retryable Playwright locators
  const preferredLinks = await page.locator('#menu a').all();
  for(const elm of preferredLinks){
      // const elmtext = await elm.textContent();
      // const elmtexttrimmed = elmtext?.trim();
      console.log(`${await elm.textContent().then(text => {return text?.trim()})}`)
  }
})

test("Waits", async ({page}) => {
  page.setDefaultTimeout(5000); //Setting an action timeout at the test level. Normally there is no action timeout (actions will be retried until the test timeout is reached)
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/dynamicContent.html',{timeout: 20000});

  //await page.locator('#delay').click();
  await page.locator('#delay').fill('10');
  await page.getByRole('link', { name: 'Load Content' }).click();
  //await page.locator('#image-holder > img').click({timeout: 5000}); //Should click the apple
  //await page.locator('#image-holder > img').click({timeout: 13000}); //Overriding the action timeout
  await page.waitForSelector('#image-holder > img', {timeout: 12000, state:'visible'}); //Waiting for an element, rather than an action on an element.
  await page.locator('#image-holder > img').click();
  
  await page.getByRole('link', { name: 'Home' }).click();

})


test("Waiting for a pop up window", async ({page, context}) => { //We need the wider 'context' to interact with multiple pages loaded in to the browser simultaniously
  await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/dynamicContent.html")

  const [newPage] = await Promise.all([ //When these two "future" actions complete return the new page fixture
      context.waitForEvent('page'),
      page.locator("#right-column > a[onclick='return popUpWindow();']").click()
  ])



  await page.waitForTimeout(2000); //Thread.sleep(2000); -- Try your very hardest to never resort to this. But if all else fails...

  await newPage.locator('.orange-button').click(); //closes the newly opened popup

  await page.getByRole('link', {name: 'Load Content'}).click();
})
