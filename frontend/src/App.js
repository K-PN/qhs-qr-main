import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';
import { getError } from './utils';
import axios from 'axios';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import ProductEditScreenAd from './screens/ProductEditScreenAd';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState([false]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);
  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? fullBox
              ? 'site-container d-flex flex-column full-box'
              : 'site-container d-flex flex-column'
            : fullBox
            ? 'site-container d-flex flex-column full-box'
            : 'site-container d-flex flex-column'
        }>
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="none" variant="dark" expand="lg">
            <Container>
              <LinkContainer to="/admin/qr">
                <Navbar.Brand className="m-auto">
                  <img
                    src="../images/logo.png"
                    width="240"
                    className="m-auto"
                    alt="Logo QHS"
                  />
                </Navbar.Brand>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                  <Link
                    className="dropdown-item"
                    to="#signout"
                    onClick={signoutHandler}>
                    Đăng xuất
                  </Link>
                </NavDropdown>
              ) : (
                ''
              )}
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/QR/:id" element={<ProductEditScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              {/* Admin Routes */}
              <Route
                path="/admin/qr"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }></Route>
              <Route
                path="/admin/qr/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreenAd />
                  </AdminRoute>
                }></Route>

              <Route path="/admin/qr" element={<ProductListScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">
            <img
              src="../images/logo-foot.png"
              width="140"
              className="m-auto"
              alt="Logo QHS"
            />
            <h6>Công ty TNHH SX DV KT Quốc Hưng</h6>
          </div>
          <ul>
            <li>
              Địa chỉ: Số 78 Đường 10/3, P. Tân Lợi, Tp. Buôn Ma Thuột, Tỉnh Đăk
              Lăk
            </li>
            <li>Hotline: 09819 12347</li>
            <li>Điện thoại: 02623 821 888</li>
            <li>
              website:{' '}
              <a href="https://candientuquochung.com">candientuquochung.com</a>
            </li>
          </ul>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
