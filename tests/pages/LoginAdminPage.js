const { expect } = require('@playwright/test');

export class LoginAdminPage {
    constructor(page) {
        this.page = page;
    }

    async visitLoginPage() {
        await this.page.goto('http://localhost:3000/admin/login');
   
        await expect(
            this.page.locator('.login-form')
        ).toBeVisible();
    }

    async submitLoginForm(username, password) {
        if (username) { await this.page.getByPlaceholder('E-mail').fill(username); }
        
        if (password) { await this.page.getByPlaceholder('Senha').fill(password); }

        await this.page.getByRole('button', { name: 'Entrar' }).click();
    }

    async expectLoginFailure() {
        await expect(this.page).toHaveURL(/.*login/);
    }

    async alertField(text) {
        await expect(
            this.page.locator('span[class$=alert]')
        ).toHaveText(text);
    }
}