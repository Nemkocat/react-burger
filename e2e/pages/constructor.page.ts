import { expect, type Locator, type Page } from '@playwright/test';

export class ConstructorPage {
  readonly page: Page;
  readonly title: Locator;
  readonly ingredientCards: Locator;
  readonly bunCards: Locator;
  readonly mainCards: Locator;
  readonly constructorDrop: Locator;
  readonly bunTopSlot: Locator;
  readonly fillingsZone: Locator;
  readonly orderButton: Locator;
  readonly modal: Locator;
  readonly modalClose: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText('Соберите бургер');
    this.ingredientCards = page.getByTestId('ingredient-card');
    this.bunCards = page.locator(
      '[data-testid="ingredient-card"][data-ingredient-type="bun"]'
    );
    this.mainCards = page.locator(
      '[data-testid="ingredient-card"][data-ingredient-type="main"]'
    );
    this.constructorDrop = page.getByTestId('burger-constructor');
    this.bunTopSlot = page.getByTestId('constructor-bun-top');
    this.fillingsZone = page.getByTestId('constructor-fillings');
    this.orderButton = page.getByRole('button', { name: 'Оформить заказ' });
    this.modal = page.getByTestId('modal');
    this.modalClose = page.getByTestId('modal-close');
  }

  async open(): Promise<void> {
    await this.page.goto('/');
    await expect(this.title).toBeVisible();
    await expect(this.ingredientCards.first()).toBeVisible();
  }

  async dragToConstructor(source: Locator, target: Locator): Promise<void> {
    const sourceElement = source.first();
    await expect(sourceElement).toBeVisible();
    await expect(target).toBeVisible();
    await sourceElement.scrollIntoViewIfNeeded();
    await target.scrollIntoViewIfNeeded();

    const dataTransfer = await this.page.evaluateHandle(() => new DataTransfer());

    await sourceElement.dispatchEvent('dragstart', { dataTransfer });
    await target.dispatchEvent('dragenter', { dataTransfer });
    await target.dispatchEvent('dragover', { dataTransfer });
    await target.dispatchEvent('drop', { dataTransfer });
    await sourceElement.dispatchEvent('dragend', { dataTransfer });
  }

  bunNameInConstructor(name: string): Locator {
    return this.constructorDrop.getByText(`${name} (верх)`, { exact: false });
  }

  fillingNameInConstructor(name: string): Locator {
    return this.fillingsZone.getByText(name, { exact: false });
  }
}
