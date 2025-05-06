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
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

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
      return { ...state, loadingCreate: false, successCreate: true };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'CREATE_RESET':
      return { ...state, successCreate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
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
      successCreate,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    successCreate: false,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [numProductsToCreate, setNumProductsToCreate] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [startIndex, setStartIndex] = useState(''); // Số thứ tự bắt đầu
  const [endIndex, setEndIndex] = useState(''); // Số thứ tự kết thúc
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/products/admin?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (successDelete || successCreate) {
      dispatch({ type: 'DELETE_RESET' });
      dispatch({ type: 'CREATE_RESET' });
      fetchData();
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete, successCreate]);

  const createHandler = async () => {
    if (
      window.confirm(
        `Bạn có chắc chắn thêm mới ${numProductsToCreate} sản phẩm?`
      )
    ) {
      try {
        dispatch({ type: 'CREATE_REQUEST' });
        if (numProductsToCreate === 1) {
          const { data } = await axios.post(
            '/api/products',
            {},
            { headers: { Authorization: `Bearer ${userInfo.token}` } }
          );
          toast.success('Tạo mới thành công');
          navigate(`/admin/qr/${data.product._id}`);
        } else {
          const promises = [];
          for (let i = 0; i < numProductsToCreate; i++) {
            promises.push(
              axios.post(
                '/api/products',
                {},
                {
                  headers: { Authorization: `Bearer ${userInfo.token}` },
                }
              )
            );
          }
          await Promise.all(promises);
          toast.success(`Tạo mới ${numProductsToCreate} sản phẩm thành công`);
          dispatch({ type: 'CREATE_SUCCESS' });
        }
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'CREATE_FAIL' });
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
        toast.error(getError(err));
        dispatch({ type: 'DELETE_FAIL' });
      }
    }
  };

  const deleteSelectedHandler = async () => {
    if (window.confirm('Bạn có chắc chắn xóa các sản phẩm đã chọn?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await Promise.all(
          selectedProducts.map((productId) =>
            axios.delete(`/api/products/${productId}`, {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            })
          )
        );
        toast.success('Xóa các sản phẩm thành công');
        setSelectedProducts([]);
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'DELETE_FAIL' });
      }
    }
  };

  const toggleSelectProduct = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p._id));
    }
  };

  // Hàm chọn sản phẩm theo khoảng số thứ tự
  const selectByIndexRange = () => {
    const start = parseInt(startIndex, 10);
    const end = parseInt(endIndex, 10);
    if (
      isNaN(start) ||
      isNaN(end) ||
      start < 1 ||
      end > products.length ||
      start > end
    ) {
      toast.error('Khoảng số thứ tự không hợp lệ');
      return;
    }
    const selected = products.slice(start - 1, end).map((p) => p._id);
    setSelectedProducts(selected);
  };

  const downloadQRCodes = async () => {
    const zip = new JSZip();
    const qrCodesToDownload =
      selectedProducts.length > 0
        ? products.filter((p) => selectedProducts.includes(p._id))
        : products;

    for (const product of qrCodesToDownload) {
      const qrCanvas = document.getElementById(`qrcode-${product._id}`);
      const qrImage = qrCanvas.toDataURL('image/png');
      const fileName = `QR-${product.serial || product._id}.png`;
      zip.file(fileName, qrImage.split(';base64,')[1], { base64: true });
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'qr-codes.zip');
  };

  return (
    <div>
      <Row>
        <Col>
          Số lượng:
          <input
            type="number"
            value={numProductsToCreate}
            onChange={(e) => setNumProductsToCreate(parseInt(e.target.value))}
            min="1"
            style={{ width: '50px' }}
          />
        </Col>
        <Col className="col text-end">
          <div>
            <Button type="button" onClick={createHandler}>
              Thêm
            </Button>
            <Button type="button" onClick={downloadQRCodes} className="ml-2">
              Tải xuống QR-Code
            </Button>
            <Button
              type="button"
              onClick={deleteSelectedHandler}
              disabled={selectedProducts.length === 0}
              className="ml-2">
              Xóa đã chọn
            </Button>
          </div>
        </Col>
      </Row>

      {/* Thêm input để chọn khoảng số thứ tự */}
      <Row className="mt-2">
        <Col>
          Chọn theo khoảng số thứ tự:
          <input
            type="number"
            placeholder="Từ"
            value={startIndex}
            onChange={(e) => setStartIndex(e.target.value)}
            style={{ width: '60px', marginLeft: '5px' }}
          />
          -
          <input
            type="number"
            placeholder="Đến"
            value={endIndex}
            onChange={(e) => setEndIndex(e.target.value)}
            style={{ width: '60px', marginLeft: '5px' }}
          />
          <Button onClick={selectByIndexRange} className="ml-2">
            Chọn
          </Button>
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
            onChange={(event) => setSearchTerm(event.target.value)}
            className="mt-2"
          />
          <Table className="table-bordered mt-2">
            <Thead>
              <Tr>
                <Th>
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length}
                    onChange={toggleSelectAll}
                  />
                </Th>
                {/* Thêm cột Số thứ tự */}
                <Th>STT</Th>
                <Th>Nhân viên lắp cân</Th>
                <Th>Hãng/Loại cân</Th>
                <Th>Serial</Th>
                <Th>Ngày lắp cân</Th>
                <Th>Khách hàng</Th>
                <Th>Số điện thoại</Th>
                <Th>Hạn bảo hành</Th>
                <Th>Ngày hết hạn</Th>
                <Th>Tùy chọn</Th>
                <Th>QR Code</Th>
              </Tr>
            </Thead>
            {products &&
              products
                .filter((product) =>
                  searchTerm === ''
                    ? product
                    : product.phone
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                )
                .map((product, index) => (
                  <Tbody key={product._id}>
                    <Tr>
                      <Td>
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product._id)}
                          onChange={() => toggleSelectProduct(product._id)}
                        />
                      </Td>
                      {/* Hiển thị số thứ tự */}
                      <Td>{index + 1}</Td>
                      <Td>{product.name}</Td>
                      <Td>{product.type}</Td>
                      <Td>{product.serial}</Td>
                      <Td>{product.iDay}</Td>
                      <Td>{product.nameCus}</Td>
                      <Td>{product.phone}</Td>
                      <Td>{product.time} tháng</Td>
                      <Td>{product.eDay}</Td>
                      <Td>
                        <Button
                          type="button"
                          variant="light"
                          onClick={() => navigate(`/qr/${product._id}`)}>
                          Chi tiết
                        </Button>{' '}
                        <Button
                          type="button"
                          variant="light"
                          onClick={() => navigate(`/admin/qr/${product._id}`)}>
                          Sửa
                        </Button>{' '}
                        <Button
                          type="button"
                          variant="light"
                          onClick={() => deleteHandler(product)}>
                          Xóa
                        </Button>
                      </Td>
                      <Td>
                        <QRCode
                          id={`qrcode-${product._id}`}
                          value={`https://doluongquochung.com/qr/${product._id}`}
                          size={200}
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
                ))}
          </Table>
        </>
      )}
    </div>
  );
}
