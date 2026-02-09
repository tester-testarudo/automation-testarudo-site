import { test, expect } from '@playwright/test';

test('Smoke Test - Formulario de Contacto',async({ page }) => {
    await page.goto('https://staging.testertestarudo.com/contacto/');
    await expect(page).toHaveTitle('Contacto – Tester Testarudo');

    await page.getByLabel('Nombre').fill('Usuario Prueba');
    await page.getByLabel('Correo electrónico').fill('test@example.com');
    await page.locator('select[name="country"]').selectOption({ label: 'Chile' });
    await page.locator('select[name="request"]').selectOption('Quiero sugerir un curso');
    await page.getByLabel('Consulta').fill('Consulta de Smoke Test');
        
    await page.locator('button[name="submit_form"], input[type="submit"]').click();
    const mensajeExito = page.getByText('Gracias por tu mensaje. Me comunicaré contigo pronto.'); 
    await expect(mensajeExito).toBeVisible();

})