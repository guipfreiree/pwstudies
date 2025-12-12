const { test, expect, request } = require('@playwright/test');
const { MoviesPage } = require('../support/actions/Movies');
const { LandingPage } = require('../support/actions/Landing');
const { Toast } = require('../support/actions/Components');
const { LoginAdminPage } = require('../support/actions/LoginAdmin');

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

