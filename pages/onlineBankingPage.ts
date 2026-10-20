import { expect, Page } from "@playwright/test";
import { GLOBAL_DATA } from "../data/GlobalData";

export default class OnlineBankingPage {

    private readonly page: Page;
    private readonly _userDropdown;
    private readonly _feedbackLink;
    private readonly _payBillsLink;

    constructor(page: Page) {
        
        this.page = page;
        this._userDropdown = this.page.getByText(GLOBAL_DATA.USERNAME);
        this._feedbackLink = this.page.locator('#feedback');
        this._payBillsLink = this.page.locator('#pay_bills_link');
    }

    async expectLogoutFeature() {

        await expect(this._userDropdown).toBeVisible();
    }

    async clickFeedbackLink() {

        await this._feedbackLink.click();
    }

    async clickPayBillsLink() {

        await this._payBillsLink.click();
    }
}