export const { expect } = require('@playwright/test');

export class MoviesPage {
    constructor(page) {
        this.page = page;
    }

    async expectLoginSuccess() {
    /*    await expect(
            this.page.locator('a[href="/logout"]')
        ).toBeVisible();*/

        await this.page.waitForLoadState('networkidle');
        await expect(this.page).toHaveURL(/.*admin/);
    }

    async createMovie(title, overview, company, release_year) {
        await this.page.click('a[href$="register"]')

        await this.page.locator('input[id="title"]').fill(title);
        await this.page.locator("textarea[id='overview']").fill(overview);

        await this.page.locator("div[id='select_company_id']").click();
        await this.page.getByText(company).click();

        await this.page.locator("div[id='select_year']").click();
        await this.page.getByText(release_year).click();

        await this.page.getByRole('button', { name: 'Cadastrar' }).click();

        const htmllist = await this.page.content()
        console.log(htmllist)



    }
}