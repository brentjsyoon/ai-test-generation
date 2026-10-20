import { expect, Page } from "@playwright/test";
import { GLOBAL_DATA } from "../data/GlobalData";

export default class HomePage {

    private readonly page: Page;
    private readonly _loginButton;
    private readonly _userDropdown;
    private readonly _onlineBankingLink;
    private readonly _logoutLink;
    private readonly _logoutConfirmation;

    constructor(page: Page) {
        
        this.page = page;
        this._loginButton = this.page.getByRole('button', { name: 'Signin' });
        this._userDropdown = this.page.getByText(GLOBAL_DATA.USERNAME);
        this._onlineBankingLink = this.page.locator('#onlineBankingMenu');
        this._logoutLink = this.page.locator('#logout_link');
        this._logoutConfirmation = this.page.getByText('You have been successfully logged out');
    }
    
    async enterLogin() {

        await this._loginButton.click();
    }

    async clickOnlineBankingLink() {

        await this._onlineBankingLink.click();
    }

    async logout() {
        
        await this._userDropdown.click();
        await this._logoutLink.click();
    }

    async expectLogoutConfirmation() {
        
        await expect(this._logoutConfirmation).toBeVisible();
    }

    get userDropdown() {

        return this._userDropdown;
    }
}