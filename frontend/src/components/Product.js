import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Store } from '../Store';

function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <Card.Title>{product.name}</Card.Title>
      </Link>
    </Card>
  );
}
export default Product;
