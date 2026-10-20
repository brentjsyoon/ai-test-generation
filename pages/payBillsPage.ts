import { expect, Locator, Page } from "@playwright/test";
import { GLOBAL_DATA } from "../data/GlobalData";
import { smartClick } from "../utilities/selfHeal";

export default class PayBillsPage {

    private readonly page;
    private readonly _addNewPayeeTab;
    private readonly _payeeNameField: Locator;
    private readonly _payeeAddressField: Locator;
    private readonly _accountField: Locator;
    private readonly _addButton: Locator;
    private readonly _confirmationMsg: Locator;
    private readonly _payeeSelector: Locator;

    constructor(page: Page) {
        
        this.page = page;
        this._addNewPayeeTab = this.page.getByText('Add New Payee');
        this._payeeNameField = this.page.locator('#np_new_payee_name');
        this._payeeAddressField = this.page.locator('#np_new_payee_address');
        this._accountField = this.page.locator('#np_new_payee_account');
        this._addButton = this.page.locator('#add_new_payee');
        this._confirmationMsg = this.page.locator('#alert_content');
        this._payeeSelector = this.page.locator('#sp_payee');
    }

    async clickAddNewPayeeTab() {

        await this._addNewPayeeTab.click();
    }

    async clickAddPayeeButton() {

        //await smartClick(this.page, '#new_payee_add');
        await this._addButton.click();
    }

    async checkValidity(element: Locator) {

        return await element.evaluate((el: HTMLInputElement) => el.checkValidity());
    }

    async fillName() {

        await this._payeeNameField.fill(GLOBAL_DATA.PAYEE_NAME);
    }

    async fillAddress() {

        await this._payeeAddressField.fill(GLOBAL_DATA.PAYEE_ADDRESS);
    }

    async fillAccount() {
        
        await this._accountField.fill(GLOBAL_DATA.ACCOUNT);
    }

    async expectThePayeeInSelector(name: string) {

        const optionLocator = this._payeeSelector.locator(`option[value="${name}"]`);
        await expect(optionLocator).toHaveCount(1);
    }

    

    get payeeName(): Locator {
        return this._payeeNameField;
    }

    get payeeAddress(): Locator {
        return this._payeeAddressField;
    }

    get account(): Locator {
        return this._accountField;
    }

    get confirmationMsg(): Locator {
        return this._confirmationMsg;
    }
}