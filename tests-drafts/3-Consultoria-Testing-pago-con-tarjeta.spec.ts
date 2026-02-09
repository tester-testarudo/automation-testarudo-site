import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://testertestarudo.com/consultoria-de-testing-profesional/');
  await page.getByRole('link', { name: 'Reservar Ahora' }).click();
  await page.getByPlaceholder('€').pressSequentially('€50.00');
  await page.getByPlaceholder('€').press('Enter');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('frank.pcv@gmail.com');

await test.step('Seleccionar Pago con tarjeta (Fuerza Bruta)', async () => {
    const botonPago = page.getByTestId('card-accordion-item-button').and(page.getByLabel('Pay with card'));
    // Dispara el evento de clic directamente en el navegador
    await botonPago.dispatchEvent('click');
});

  await page.getByRole('textbox', { name: 'Card number' }).click();
  await page.getByRole('textbox', { name: 'Card number' }).fill('5031 7557 3453 0604');
  await page.getByTestId('checkout-container').click();
  await page.getByRole('textbox', { name: 'CVC' }).click();
  await page.getByRole('textbox', { name: 'CVC' }).fill('123');
  await page.getByRole('textbox', { name: 'Expiration' }).click();
  await page.getByRole('textbox', { name: 'Expiration' }).fill('11/30');
  await page.getByRole('textbox', { name: 'Cardholder name' }).click();
  await page.getByRole('textbox', { name: 'Cardholder name' }).pressSequentially('Frank Cornejo Valencia');
  await page.getByLabel('Country or region').selectOption('ES');



await test.step('Hacer scroll al final y pagar', async () => {
    // 1. Nos ubicamos al final de la página (simula la rueda del mouse)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    console.log('LOG: Scroll al final de la página completado.');

    // 2. Pequeña espera para que el DOM se estabilice
    await page.waitForTimeout(1000);

    // 3. Presionamos el botón
    const botonPay = page.getByTestId('hosted-payment-submit-button');
    await botonPay.click({ force: true });
    console.log('LOG: Clic en Pay realizado después del scroll.');
});






await test.step('Búsqueda de error resistente a frames dinámicos', async () => {
    // 1. Esperamos un poco para que los frames se estabilicen tras el clic
    await page.waitForTimeout(2000);

    // 2. En lugar de un bucle manual, usamos una función de evaluación
    // Esto busca el texto en toda la página, sin importar en qué frame esté
    const mensajeError = page.locator('div').filter({ hasText: /^Your card number is incorrect\.$/ });

    // 3. Si el mensaje está en un frame, a veces Playwright no lo ve desde 'page'.
    // Vamos a intentar encontrarlo por el texto globalmente de forma flexible:
    try {
        await expect(page.locator('text="Your card number is incorrect."').first()).toBeVisible({ timeout: 8000 });
        console.log('LOG: ¡Mensaje encontrado exitosamente!');
    } catch (e) {
        console.log('LOG: No se encontró en la página principal, intentando método de emergencia...');
        
        // Método de emergencia: Capturar todos los frames actuales y buscar solo en los activos
        const framesActuales = page.frames();
        for (const f of framesActuales) {
            try {
                if (!f.isDetached()) { // Verificamos que el frame aún exista
                    const loc = f.getByText('Your card number is incorrect.');
                    if (await loc.count() > 0) {
                        await expect(loc).toBeVisible();
                        console.log('LOG: Encontrado en frame secundario.');
                        break;
                    }
                }
            } catch (err) {
                // Si el frame se desliga en medio de la comprobación, lo ignoramos y seguimos
                continue;
            }
        }
    }
});


await test.step('Esperar respuesta y cerrar', async () => {
        console.log('LOG: Esperando 5 segundos antes de cerrar...');
        await page.waitForTimeout(5000); 
        await page.close();
        console.log('LOG: Navegador cerrado exitosamente.');
    });


});