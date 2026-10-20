import { expect, Page } from "@playwright/test";

export default class LoginPage {

    public readonly page;
    private readonly _loginField;
    private readonly _passwordField;
    private readonly _keepMeSignedInBox;
    private readonly _signInButton;
    private readonly _errorMsg;
    private readonly _requiredErrors;

    constructor(page : Page) {

        this.page = page;
        this._loginField = this.page.locator('#user_login');
        this._passwordField = this.page.locator('#user_password');
        this._keepMeSignedInBox = this.page.locator('#user_remember_me');
        this._signInButton = this.page.getByRole('button', { name : 'Sign in' });
        this._errorMsg = this.page.getByText('Login and/or password are wrong.');
        this._requiredErrors = this.page.getByText('Required');
    }

    async inputLogin(username: string) {

        await this.clearLogin();
        await this._loginField.fill(username);
    }

    async clearLogin() {

        await this._loginField.clear();
    }

    async inputPassword(password: string) {

        await this.clearPassword();
        await this._passwordField.fill(password);
    }

    async clearPassword() {

        await this._passwordField.clear();
    }

    async clickSignIn() {
        
        await this._signInButton.click();
    }

    async expectRequiredErrors() {

        await expect(this._requiredErrors).toHaveCount(2);
    }

    async clickKeepMeSignedIn() {

        await this._keepMeSignedInBox.click();
    }

    async goBack() {

        await this.page.waitForTimeout(1000);
        await this.page.goBack();
        await this.page.waitForTimeout(1000);
    }

    get loginField() {

        return this._loginField;
    }

    get passwordField() {

        return this._passwordField;
    }

    get errorMsg() {

        return this._errorMsg;
    }
}