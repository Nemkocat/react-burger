import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, test } from '@playwright/test';

import { ConstructorPage } from './pages/constructor.page';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const harPath = path.join(__dirname, 'hars', 'constructor.har');

const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Хрустящие минеральные кольца';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(harPath, {
      url: '**/api/**',
      update: false,
    });

    await page.addInitScript(() => {
      localStorage.setItem('accessToken', 'Bearer test-access-token');
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    const constructorPage = new ConstructorPage(page);
    await constructorPage.open();
  });

  test('перетаскивание ингредиента в конструктор', async ({ page }) => {
    const constructorPage = new ConstructorPage(page);
    const bunCard = constructorPage.bunCards.filter({ hasText: BUN_NAME }).first();
    const mainCard = constructorPage.mainCards.filter({ hasText: MAIN_NAME }).first();

    await constructorPage.dragToConstructor(bunCard, constructorPage.bunTopSlot);
    await expect(constructorPage.bunNameInConstructor(BUN_NAME)).toBeVisible();

    await constructorPage.dragToConstructor(mainCard, constructorPage.fillingsZone);
    await expect(constructorPage.fillingNameInConstructor(MAIN_NAME)).toBeVisible();
  });

  test('открытие модального окна с описанием ингредиента', async ({ page }) => {
    const constructorPage = new ConstructorPage(page);
    const bunCard = constructorPage.bunCards.filter({ hasText: BUN_NAME }).first();

    await bunCard.click();

    await expect(constructorPage.modal).toBeVisible();
    await expect(page.getByText('Детали ингредиента')).toBeVisible();
  });

  test('отображение в модальном окне данных ингредиента', async ({ page }) => {
    const constructorPage = new ConstructorPage(page);
    const bunCard = constructorPage.bunCards.filter({ hasText: BUN_NAME }).first();

    await bunCard.click();

    await expect(
      constructorPage.modal.getByRole('heading', { name: BUN_NAME })
    ).toBeVisible();
    await expect(constructorPage.modal.getByText('Калории, ккал')).toBeVisible();
    await expect(constructorPage.modal.getByText('Белки, г')).toBeVisible();
    await expect(constructorPage.modal.getByText('Жиры, г')).toBeVisible();
    await expect(constructorPage.modal.getByText('Углеводы, г')).toBeVisible();
  });

  test('открытие модального окна заказа по кнопке «Оформить заказ»', async ({
    page,
  }) => {
    const constructorPage = new ConstructorPage(page);
    const bunCard = constructorPage.bunCards.filter({ hasText: BUN_NAME }).first();
    const mainCard = constructorPage.mainCards.filter({ hasText: MAIN_NAME }).first();

    await constructorPage.dragToConstructor(bunCard, constructorPage.bunTopSlot);
    await constructorPage.dragToConstructor(mainCard, constructorPage.fillingsZone);

    await expect(constructorPage.orderButton).toBeEnabled();
    await constructorPage.orderButton.click();

    await expect(constructorPage.modal).toBeVisible();
    await expect(page.getByText('Ваш заказ начали готовить')).toBeVisible();
    await expect(page.getByText('060842')).toBeVisible();
    await expect(page.getByText('Дождитесь его на орбитальной станции')).toBeVisible();
  });

  test('закрытие модальных окон по кнопке закрытия', async ({ page }) => {
    const constructorPage = new ConstructorPage(page);
    const bunCard = constructorPage.bunCards.filter({ hasText: BUN_NAME }).first();

    await bunCard.click();
    await expect(constructorPage.modal).toBeVisible();

    await constructorPage.modalClose.click();
    await expect(constructorPage.modal).toHaveCount(0);

    await constructorPage.dragToConstructor(bunCard, constructorPage.bunTopSlot);
    await constructorPage.orderButton.click();
    await expect(constructorPage.modal).toBeVisible();

    await constructorPage.modalClose.click();
    await expect(constructorPage.modal).toHaveCount(0);
  });
});
