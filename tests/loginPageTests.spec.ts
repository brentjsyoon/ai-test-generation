import { GLOBAL_DATA } from "../data/GlobalData";
import { expect, test } from "../fixtures/Hooks";

test("Test 01 - Test that login fields are visible and password is masked", async ({ loginPage, homePage }) => {
    
    // Enter the login page
    await homePage.enterLogin();

    // Assert field visibility
    await expect(loginPage.loginField).toBeVisible();
    await expect(loginPage.passwordField).toBeVisible();

    // Assert masked password
    await expect(loginPage.passwordField).toHaveAttribute('type', 'password');
});

test("Test 02 - Test required prompt for blank fields", async ({ loginPage, homePage }) => {

    // Enter the login page
    await homePage.enterLogin();

    // Clear username and password fields
    await loginPage.clearLogin();
    await loginPage.clearPassword();

    await loginPage.clickSignIn();

    // Assert inline 'Required' prompt in the blank fields
    await loginPage.expectRequiredErrors();
});

test("Test 03 - Test invalid credentials triggers an error message", async ({ loginPage, homePage }) => {

    // Enter the login page
    await homePage.enterLogin();

    // Clear username and password fields
    await loginPage.inputLogin("user");
    await loginPage.inputPassword("test");

    await loginPage.clickSignIn();

    // Assert error message
    await expect(loginPage.errorMsg).toBeVisible();
});

test("Test 04 - Test successful login navigates to dashboard page", async ({ loginPage, homePage }) => {

    // Enter the login page
    await homePage.enterLogin();

    // Clear username and password fields
    await loginPage.inputLogin(GLOBAL_DATA.USERNAME);
    await loginPage.inputPassword(GLOBAL_DATA.PASSWORD);

    await loginPage.clickSignIn();

    await loginPage.goBack();

    await expect(homePage.userDropdown).toBeVisible();
});

test("Test 05 - Test Keep Me Signed In persists after browser restart", async ({ browser }) => {

    // First browser session
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();

    await page1.goto(GLOBAL_DATA.ZERO_BANK);
    await page1.getByRole('button', { name: 'Signin' }).click();

    await page1.locator('#user_login').fill(GLOBAL_DATA.USERNAME);
    await page1.locator('#user_password').fill(GLOBAL_DATA.PASSWORD);
    await page1.locator('#user_remember_me').check();
    await page1.getByRole('button', { name: 'Sign in' }).click();

    // Wait for login to complete properly
    await page1.waitForLoadState('networkidle');

    // Save session
    await context1.storageState({ path: 'auth.json' });

    await context1.close();

    // Simulate browser restart
    const context2 = await browser.newContext({
        storageState: 'auth.json'
    });

    const page2 = await context2.newPage();
    await page2.goto(GLOBAL_DATA.ZERO_BANK);

    await expect(page2.getByText(GLOBAL_DATA.USERNAME)).toBeVisible();
});

test("Test 06 - Test logout feature is present on all pages while signed in", async ({ loginPage, homePage, onlineBankingPage, feedbackPage }) => {

    // Enter the login page
    await homePage.enterLogin();

    // Clear username and password fields
    await loginPage.inputLogin(GLOBAL_DATA.USERNAME);
    await loginPage.inputPassword(GLOBAL_DATA.PASSWORD);

    await loginPage.clickKeepMeSignedIn();
    await loginPage.clickSignIn();
    await loginPage.goBack();

    await homePage.clickOnlineBankingLink();

    await onlineBankingPage.expectLogoutFeature();
    await onlineBankingPage.clickFeedbackLink();

    await feedbackPage.expectLogoutFeature();
});

test("Test 07 - Test logging out ", async ({ loginPage, homePage, onlineBankingPage, feedbackPage }) => {

    // Enter the login page
    await homePage.enterLogin();

    // Clear username and password fields
    await loginPage.inputLogin(GLOBAL_DATA.USERNAME);
    await loginPage.inputPassword(GLOBAL_DATA.PASSWORD);

    await loginPage.clickKeepMeSignedIn();
    await loginPage.clickSignIn();
    await loginPage.goBack();

    await homePage.logout();

    await homePage.expectLogoutConfirmation();
});