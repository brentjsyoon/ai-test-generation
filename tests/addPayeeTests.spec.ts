import { GLOBAL_DATA } from "../data/GlobalData";
import { expect, test } from "../fixtures/Hooks";
import { generateEdgeCases } from "../utilities/aiEdgeCaseGenerator";
import { runEdgeCases } from "../utilities/aiEdgeCaseRunner";
import { extractAddPayeeFormContext } from "../utilities/formContextExtractor";


test("Test 01 - Test all field except 'Payee Details' are required", async ({ onlineBankingPage, payBillsPage, loginPage, homePage }) => {
    

    // Enter the login page
    await homePage.enterLogin();

    // Clear username and password fields
    await loginPage.inputLogin(GLOBAL_DATA.USERNAME);
    await loginPage.inputPassword(GLOBAL_DATA.PASSWORD);

    await loginPage.clickSignIn();

    await loginPage.goBack();

    await homePage.clickOnlineBankingLink();

    await onlineBankingPage.clickPayBillsLink();

    await payBillsPage.clickAddNewPayeeTab();

    // Expected field assertions
    await expect(payBillsPage.payeeName).toHaveAttribute('required', 'required');
    await expect(payBillsPage.payeeAddress).toHaveAttribute('required', 'required');
    await expect(payBillsPage.account).toHaveAttribute('required', 'required');
});

test("Test 02 - Test the required fields trigger error handling when passed empty value", async ({ onlineBankingPage, payBillsPage, loginPage, homePage }) => {
    
    // Enter the login page
    await homePage.enterLogin();

    // Clear username and password fields
    await loginPage.inputLogin(GLOBAL_DATA.USERNAME);
    await loginPage.inputPassword(GLOBAL_DATA.PASSWORD);

    await loginPage.clickSignIn();

    await loginPage.goBack();

    await homePage.clickOnlineBankingLink();

    await onlineBankingPage.clickPayBillsLink();

    await payBillsPage.clickAddNewPayeeTab();

    await payBillsPage.clickAddPayeeButton();

    let isValid = await payBillsPage.checkValidity(payBillsPage.payeeName);
    expect(isValid).toBeFalsy();
    await payBillsPage.fillName();
    await payBillsPage.clickAddPayeeButton();

    isValid = await payBillsPage.checkValidity(payBillsPage.payeeAddress);
    expect(isValid).toBeFalsy();
    await payBillsPage.fillAddress();
    await payBillsPage.clickAddPayeeButton();

    isValid = await payBillsPage.checkValidity(payBillsPage.account);
    expect(isValid).toBeFalsy();
});

test("Test 03 - Test that a successful form entry and adding the payee displays a confirmation message", async ({ onlineBankingPage, payBillsPage, loginPage, homePage }) => {
    
    // Enter the login page
    await homePage.enterLogin();

    // Clear username and password fields
    await loginPage.inputLogin(GLOBAL_DATA.USERNAME);
    await loginPage.inputPassword(GLOBAL_DATA.PASSWORD);

    await loginPage.clickSignIn();

    await loginPage.goBack();

    await homePage.clickOnlineBankingLink();

    await onlineBankingPage.clickPayBillsLink();

    await payBillsPage.clickAddNewPayeeTab();

    await payBillsPage.fillName();
    await payBillsPage.fillAddress();
    await payBillsPage.fillAccount();

    await payBillsPage.clickAddPayeeButton();

    await expect(payBillsPage.confirmationMsg).toBeVisible();
});

test("Test 04 - Test that a successful payee addition reflects on the database", async ({ onlineBankingPage, payBillsPage, loginPage, homePage }) => {
    
    // Enter the login page
    await homePage.enterLogin();

    // Clear username and password fields
    await loginPage.inputLogin(GLOBAL_DATA.USERNAME);
    await loginPage.inputPassword(GLOBAL_DATA.PASSWORD);

    await loginPage.clickSignIn();

    await loginPage.goBack();

    await homePage.clickOnlineBankingLink();

    await onlineBankingPage.clickPayBillsLink();

    await payBillsPage.clickAddNewPayeeTab();

    await payBillsPage.fillName();
    await payBillsPage.fillAddress();
    await payBillsPage.fillAccount();

    await payBillsPage.clickAddPayeeButton();

    await payBillsPage.expectThePayeeInSelector(GLOBAL_DATA.PAYEE_NAME);
});

test("Test 05 - Test 'Add New Payee' form with AI generated cases", async ({ onlineBankingPage, payBillsPage, loginPage, homePage, page }) => {

    await homePage.enterLogin();
    await loginPage.inputLogin(GLOBAL_DATA.USERNAME);
    await loginPage.inputPassword(GLOBAL_DATA.PASSWORD);
    await loginPage.clickSignIn();
    await loginPage.goBack();
    await homePage.clickOnlineBankingLink();
    await onlineBankingPage.clickPayBillsLink();
    await payBillsPage.clickAddNewPayeeTab();

    // Extract context
    const schema = await extractAddPayeeFormContext(page);

    if (!schema) {
        throw new Error("Failed to extract Add Payee form schema");
    }

    // Generate AI edge cases
    const result = await generateEdgeCases(schema);

    // edgeCases is the array inside the "cases" object
    const edgeCases = result.cases;

    console.log("AI Generated Cases:", edgeCases);

    // Execute them
    await runEdgeCases(
        page,
        payBillsPage,
        edgeCases,
        "#add_new_payee",
        "#alert_content"
    );
});