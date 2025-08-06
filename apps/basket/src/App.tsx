import { Layout, Typography } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { Basket } from '@/components/Basket';
import { removeFromCart, updateQuantity, clearCart } from '@/lib/store';
import type { RootState } from '@/lib/store';

const { Content } = Layout;
const { Title } = Typography;

function App() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleClearBasket = () => {
    dispatch(clearCart());
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Title level={2} style={{ marginBottom: '24px', textAlign: 'center' }}>
            Basket Micro-Frontend
          </Title>
          <Basket
            items={cartItems}
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
            onClearBasket={handleClearBasket}
          />
        </div>
      </Content>
    </Layout>
  );
}

export default App;
