import type { TIngredient, TOrder, TOrderStatus } from '@utils/types';

const ORDER_STATUSES: TOrderStatus[] = ['created', 'pending', 'done'];

export const getOrderStatusText = (status: TOrderStatus): string => {
  switch (status) {
    case 'done':
      return 'Выполнен';
    case 'pending':
      return 'Готовится';
    case 'created':
      return 'Создан';
    default:
      return '';
  }
};

export const isValidOrder = (order: unknown): order is TOrder => {
  if (!order || typeof order !== 'object') {
    return false;
  }

  const candidate = order as Partial<TOrder>;

  return (
    typeof candidate._id === 'string' &&
    candidate._id.length > 0 &&
    Array.isArray(candidate.ingredients) &&
    candidate.ingredients.length > 0 &&
    candidate.ingredients.every((id) => typeof id === 'string' && id.length > 0) &&
    typeof candidate.status === 'string' &&
    ORDER_STATUSES.includes(candidate.status) &&
    typeof candidate.number === 'number' &&
    Number.isFinite(candidate.number) &&
    typeof candidate.createdAt === 'string' &&
    candidate.createdAt.length > 0 &&
    typeof candidate.updatedAt === 'string' &&
    candidate.updatedAt.length > 0
  );
};

export const filterValidOrders = (orders: unknown[]): TOrder[] =>
  orders.filter(isValidOrder).map((order) => ({
    ...order,
    name: typeof order.name === 'string' && order.name.length > 0 ? order.name : '',
  }));

export const getOrderIngredients = (
  order: TOrder,
  ingredients: TIngredient[]
): TIngredient[] =>
  order.ingredients
    .map((id) => ingredients.find((item) => item._id === id))
    .filter((item): item is TIngredient => Boolean(item));

export const getOrderPrice = (order: TOrder, ingredients: TIngredient[]): number =>
  getOrderIngredients(order, ingredients).reduce((sum, item) => sum + item.price, 0);

export const getOrderName = (order: TOrder, ingredients: TIngredient[]): string => {
  if (order.name) {
    return order.name;
  }

  const orderIngredients = getOrderIngredients(order, ingredients);
  const bun = orderIngredients.find((item) => item.type === 'bun');

  return bun ? `${bun.name} бургер` : 'Бургер';
};

type TCountedIngredient = {
  ingredient: TIngredient;
  count: number;
};

export const getCountedIngredients = (
  order: TOrder,
  ingredients: TIngredient[]
): TCountedIngredient[] => {
  const counts = new Map<string, TCountedIngredient>();

  getOrderIngredients(order, ingredients).forEach((ingredient) => {
    const existing = counts.get(ingredient._id);

    if (existing) {
      existing.count += 1;
    } else {
      counts.set(ingredient._id, { ingredient, count: 1 });
    }
  });

  return Array.from(counts.values());
};

const getTimeZoneLabel = (): string => {
  const offsetMinutes = -new Date().getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const hours = Math.floor(Math.abs(offsetMinutes) / 60);

  return `i-GMT${sign}${hours}`;
};

const getDayWord = (days: number): string => {
  const lastDigit = days % 10;
  const lastTwoDigits = days % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'дней';
  }

  if (lastDigit === 1) {
    return 'день';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'дня';
  }

  return 'дней';
};

export const formatOrderDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfOrderDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayDiff = Math.round(
    (startOfToday.getTime() - startOfOrderDay.getTime()) / (1000 * 60 * 60 * 24)
  );

  const time = date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const timeZone = getTimeZoneLabel();

  if (dayDiff === 0) {
    return `Сегодня, ${time} ${timeZone}`;
  }

  if (dayDiff === 1) {
    return `Вчера, ${time} ${timeZone}`;
  }

  return `${dayDiff} ${getDayWord(dayDiff)} назад, ${time} ${timeZone}`;
};

export const splitOrdersByColumns = (
  numbers: number[],
  perColumn: number,
  maxColumns: number
): number[][] => {
  const limited = numbers.slice(0, perColumn * maxColumns);
  const columns: number[][] = [];

  for (let index = 0; index < limited.length; index += perColumn) {
    columns.push(limited.slice(index, index + perColumn));
  }

  return columns;
};

export const getAccessTokenForSocket = (accessToken: string): string =>
  accessToken.replace(/^Bearer\s+/i, '');
