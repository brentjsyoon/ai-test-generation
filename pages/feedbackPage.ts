import { expect, Page } from "@playwright/test";
import { GLOBAL_DATA } from "../data/GlobalData";

export default class FeedbackPage {

    private readonly page: Page;
    private readonly _userDropdown;

    constructor(page: Page) {
        
        this.page = page;
        this._userDropdown = this.page.getByText(GLOBAL_DATA.USERNAME);
    }

    async expectLogoutFeature() {

        await expect(this._userDropdown).toBeVisible();
    }
}