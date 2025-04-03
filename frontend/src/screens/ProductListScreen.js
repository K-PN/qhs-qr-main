import React, { useContext, useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import QRCode from 'qrcode.react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
      };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };

    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function ProductListScreen() {
  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products/admin?page=${page} `, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const createHandler = async () => {
    if (window.confirm('Bạn có chắc chắn thêm mới?')) {
      try {
        dispatch({ type: 'CREATE_REQUEST' });
        const { data } = await axios.post(
          '/api/products',
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success('Tạo mới thành công');
        dispatch({ type: 'CREATE_SUCCESS' });
        navigate(`/admin/qr/${data.product._id}`);
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'CREATE_FAIL',
        });
      }
    }
  };

  const deleteHandler = async (product) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Xóa thành công');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  return (
    <div>
      <Row>
        <Col className="col text-end">
          <div>
            <Button type="button" onClick={createHandler}>
              Thêm
            </Button>
          </div>
        </Col>
      </Row>

      {loadingCreate && <LoadingBox></LoadingBox>}
      {loadingDelete && <LoadingBox></LoadingBox>}

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <input
            type="text"
            placeholder="Nhập SĐT..."
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
          />
          <Table className="table-bordered">
            <Thead>
              <Tr>
                <Th>Tên Khách hàng</Th>
                <Th>Số điện thoại</Th>
                <Th>Serial</Th>
                <Th>Model</Th>
                <Th>Hạn bảo hành</Th>
                <Th>Ngày hết hạn</Th>
                <Th>Tùy chọn</Th>
                <Th>QR Code</Th>
              </Tr>
            </Thead>
            {products &&
              products
                .filter((product) => {
                  if (searchTerm === '') {
                    return product;
                  } else if (
                    product.phone
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  ) {
                    return product;
                  }
                })
                .map((product, index) => {
                  return (
                    <>
                      <Tbody>
                        <Tr key={product._id}>
                          <Td>{product.name}</Td>
                          <Td>{product.phone}</Td>
                          <Td>{product.serial}</Td>
                          <Td>{product.model}</Td>
                          <Td>{product.time} tháng</Td>
                          <Td>{product.eDay}</Td>
                          <Td>
                            <Button
                              type="button"
                              variant="light"
                              onClick={() => navigate(`/qr/${product._id}`)}>
                              Chi tiết
                            </Button>
                            &nbsp;
                            <Button
                              type="button"
                              variant="light"
                              onClick={() =>
                                navigate(`/admin/qr/${product._id}`)
                              }>
                              Sửa
                            </Button>
                            &nbsp;
                            <Button
                              type="button"
                              variant="light"
                              onClick={() => deleteHandler(product)}>
                              Xóa
                            </Button>
                          </Td>
                          <Td>
                            <QRCode
                              id="qrcode"
                              value={`https://doluongquochung.com/qr/${product._id}`}
                              size={120}
                              level={'H'}
                              includeMargin={true}
                              imageSettings={{
                                src: '../images/logoQHS.png',
                                excavate: true,
                              }}
                            />
                          </Td>
                        </Tr>
                      </Tbody>
                    </>
                  );
                })}
          </Table>
        </>
      )}
    </div>
  );
}
