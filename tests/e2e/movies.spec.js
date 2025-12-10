const { test, expect, request } = require('@playwright/test');
const { MoviesPage } = require('../pages/MoviesPage');
const { LandingPage } = require('../pages/LandingPage');
const { Toast } = require('../pages/Components');
const { LoginAdminPage } = require('../pages/LoginAdminPage');

const data = require('../support/fixtures/movies.json');
const { executeSql } = require('../support/database');

/**
 * @type {LandingPage}
 */
let landingPage
/**
 * @type {MoviesPage}
 */
let moviesPage
/**
 * @type {LoginAdminPage}
 */
let loginAdminPage
/**
 * @type {Toast}
 */
let toast

test.beforeEach(({ page }) => {
    loginAdminPage = new LoginAdminPage(page);
    moviesPage = new MoviesPage(page);
    toast = new Toast(page);
});

test('deve cadastrar um novo filme', async ({ page }) => {
    const movie = data.a_noite_dos_mortos_vivos;

    await executeSql(`DELETE FROM movies WHERE title = '${movie.title}';`)

    await loginAdminPage.visitLoginPage()
    await loginAdminPage.submitLoginForm('admin@zombieplus.com', 'pwd123');
    await moviesPage.expectLoginSuccess()
    await moviesPage.createMovie(movie.title, movie.overview, movie.company, movie.release_year)
    await toast.containText('Cadastro realizado com sucesso!')
})