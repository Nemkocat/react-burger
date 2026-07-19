import { useParams } from 'react-router-dom';

import { OrderInfo } from '@components/order-info/order-info';

export const OrderInfoPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <main className="mt-30">
        <p className="text text_type_main-default">Заказ не найден</p>
      </main>
    );
  }

  return (
    <main>
      <OrderInfo orderNumber={id} />
    </main>
  );
};
