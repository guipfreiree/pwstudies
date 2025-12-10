// @ts-check
const { test, expect, request } = require('@playwright/test');
const { faker } = require('@faker-js/faker');
const { LandingPage } = require('../pages/LandingPage');
const { Toast } = require('../pages/Components');

/**
 * @type {LandingPage}
 */
let landingPage
/**
 * @type {Toast}
 */
let toast



test.beforeEach(async ({ page }) => {
  landingPage = new LandingPage(page);
  toast = new Toast(page);
  await landingPage.visitHomePage();
  await landingPage.openLandingModal();
})

test('cadastra uma lead na fila de espera', async ({ page }) => {
  const leadName = faker.person.firstName() + ' ' + faker.person.lastName();
  const leadEmail = faker.internet.email({ firstName: leadName.split(' ')[0], lastName: leadName.split(' ')[1] });
  const toastMessage = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!'

  await landingPage.submitLeadForm(leadName, leadEmail);

  await toast.haveText(toastMessage);
});

// test.only('should create a new resource via POST request', async ({ request }) => {
//   const apiUrl = 'http://localhost:3000/api/leads'; // Replace with your API endpoint

//   const postData = {
//     name: 'Gui Freire',
//     email: 'gui.freire@example.com'
//   };

//   const response = await request.post(apiUrl, {
//     data: postData,
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': 'Bearer your_auth_token' // Optional: Add authentication headers
//     }
//   });
//   console.log(response);

//   expect(response.ok()).toBeTruthy(); // Check if the request was successful (status code 2xx)
  //const responseBody = await response.json();
  //expect(responseBody).toHaveProperty('id'); // Example: Check for an 'id' in the response
  //expect(responseBody.name).toBe(postData.name);
// })

test.only('não cadastra uma lead quando email já existe', async ({ page, request }) => {
  const leadName = faker.person.firstName() + ' ' + faker.person.lastName();
  const leadEmail = faker.internet.email({ firstName: leadName.split(' ')[0], lastName: leadName.split(' ')[1] });
  const toastMessageDuplicate = 'O endereço de e-mail fornecido já está registrado em nossa fila de espera.'
  const toastMessageSuccess = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!'

  // await landingPage.submitLeadForm(leadName, leadEmail);
  
  // await toast.haveText(toastMessageSuccess);

  const newLead = await request.post('http://localhost:3000/api/leads', {
    data: {
      name: leadName,
      email: leadEmail
    }
  })
  expect(newLead.ok()).toBeTruthy() ;

  await landingPage.visitHomePage();
  await landingPage.openLandingModal();
  await landingPage.submitLeadForm(leadName, leadEmail);

  await toast.haveText(toastMessageDuplicate);

  // await expect(
  //   page.getByText(toastMessageDuplicate)
  // ).toBeVisible();
});

test('não cadastra com email inválido', async ({ page }) => {

  await landingPage.submitLeadForm('Guilherme Freire', 'guilherme.com.br');
  
  await landingPage.alertHaveText('Email incorreto');

  await expect(
    page.getByTestId('modal').getByRole('heading')
  ).toHaveText('Fila de espera');
});

test('não cadastra com nome não preenchido', async ({ page }) => {

  await landingPage.submitLeadForm('', 'guilherme@gmail.com');

  await landingPage.alertHaveText('Campo obrigatório');
  
  await expect(
    page.getByTestId('modal').getByRole('heading')
  ).toHaveText('Fila de espera');
});

test('não cadastra com email não é preenchido', async ({ page }) => {


  await landingPage.submitLeadForm('Guilherme Freire', '');

  await expect(
    page.locator('.alert')
  ).toHaveText('Campo obrigatório');

  await expect(
    page.getByTestId('modal').getByRole('heading')
  ).toHaveText('Fila de espera');
});

test('não cadastra com nome e email não preenchidos', async ({ page }) => {

  await landingPage.submitLeadForm();

  await landingPage.alertHaveText([
    'Campo obrigatório',
    'Campo obrigatório'
  ]);

  await expect(
    page.getByTestId('modal').getByRole('heading')
  ).toHaveText('Fila de espera');
});