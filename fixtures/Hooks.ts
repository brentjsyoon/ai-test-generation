import { test as base } from "@playwright/test";
import { GLOBAL_DATA } from "../data/GlobalData";
import HomePage from "../pages/homePage";
import LoginPage from "../pages/loginPage";
import OnlineBankingPage from "../pages/onlineBankingPage";
import FeedbackPage from "../pages/feedbackPage";
import PayBillsPage from "../pages/payBillsPage";

type CustomFixtures = {

    homePage : HomePage,
    loginPage : LoginPage,
    onlineBankingPage : OnlineBankingPage,
    feedbackPage : FeedbackPage,
    payBillsPage : PayBillsPage
};

export const test = base.extend<CustomFixtures> ({

    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },

    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    onlineBankingPage: async ({ page }, use) => {
        const onlineBankingPage = new OnlineBankingPage(page);
        await use(onlineBankingPage);
    },

    feedbackPage: async ({ page }, use) => {
        const feedbackPage = new FeedbackPage(page);
        await use(feedbackPage);
    },

    payBillsPage: async ({ page }, use) => {
        const payBillsPage = new PayBillsPage(page);
        await use(payBillsPage);
    }
});

export { expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {

    await page.goto(GLOBAL_DATA.ZERO_BANK);
});