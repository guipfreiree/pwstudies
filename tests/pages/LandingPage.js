const { expect } = require('@playwright/test');

export class LandingPage {

    constructor(page) {
        this.page = page;
    }

    async visitHomePage() {
        await this.page.goto('http://localhost:3000/');
    }

    async openLandingModal() {
        await this.page.getByRole('button', { name: /Aperte o play/ }).click();

        await expect( 
            this.page.getByTestId('modal').getByRole('heading')
          ).toHaveText('Fila de espera');
    }

    async submitLeadForm(name, email) {
        if (name) {
            await this.page.locator('#name').fill(name);
        }
        if (email) {
            await this.page.locator('#email').fill(email);
        }
        await this.page.getByRole('button', { name: 'Quero entrar na fila!' }).click();
    }

    async alertHaveText(target) {
        await expect(
            this.page.locator('.alert')
          ).toHaveText(target);
    }
}