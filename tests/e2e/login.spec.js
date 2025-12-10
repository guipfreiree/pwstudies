const { test, expect } = require('@playwright/test');
const { MoviesPage } = require('../pages/MoviesPage');
const { Toast } = require('../pages/Components');
const { LoginAdminPage } = require('../pages/LoginAdminPage');

/**
 * @type {LoginAdminPage}
 */
let loginAdminPage
/**
 * @type {Toast}
 */
let toast
/**
 * @type {MoviesPage}
 */
let moviesPage

test.beforeEach(async ({ page }) => {
    loginAdminPage = new LoginAdminPage(page);
    moviesPage = new MoviesPage(page);
    toast = new Toast(page);
})

test('deve logar como admin', async ({ page }) => { 
    await loginAdminPage.visitLoginPage();
    await loginAdminPage.submitLoginForm('admin@zombieplus.com', 'pwd123');
    await moviesPage.expectLoginSuccess()
})

test('não deve logar com senha incorreta', async ({ page }) => { 
    await loginAdminPage.visitLoginPage();
    await loginAdminPage.submitLoginForm('admin@zombieplus.com', 'wrongpassword');

    const message = 'Oops!Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.';

    await toast.haveText(message);

    await loginAdminPage.expectLoginFailure();
})

test('não deve logar sem email inválido', async ({ page }) => { 
    await loginAdminPage.visitLoginPage();
    await loginAdminPage.submitLoginForm('www.google.com', 'pwd123');

    const text = 'Email incorreto';

    await loginAdminPage.alertField(text);
})

test('não deve logar sem email informado', async ({ page }) => { 
    await loginAdminPage.visitLoginPage();
    await loginAdminPage.submitLoginForm('', 'wrongpassword');

    const text = 'Campo obrigatório';

    await loginAdminPage.alertField(text);
})

test('não deve logar sem senha informada', async ({ page }) => { 
    await loginAdminPage.visitLoginPage();
    await loginAdminPage.submitLoginForm('admin@zombieplus.com', '');

    const text = 'Campo obrigatório';

    await loginAdminPage.alertField(text);
})

test('não deve logar sem email e senha informados', async ({ page }) => { 
    await loginAdminPage.visitLoginPage();
    await loginAdminPage.submitLoginForm();

    const text = 'Campo obrigatório';

    await loginAdminPage.alertField([text, text]);
})