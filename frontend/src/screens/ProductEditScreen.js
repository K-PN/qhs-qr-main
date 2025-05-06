import React, { useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getError } from '../utils';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import ProductEditScreen2 from './ProductEditScreen2';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};
export default function ProductEditScreen() {
  const params = useParams(); // /product/:id
  const { id: productId } = params;
  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const today = new Date();
  const curDate =
    today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();

  const expDate =
    today.getDate() + '-' + (today.getMonth() + 7) + '-' + today.getFullYear();

  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [serial, setSerial] = useState('');
  const [loadCell, setLoadCell] = useState('');
  const [iDay, setiDay] = useState('');
  const [nameCus, setNameCus] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [time, setTime] = useState(0);
  const [sDay, setsDay] = useState('');
  const [eDay, seteDay] = useState('');
  const [enable, setEnable] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/products/${productId}`);
        setSlug(data.slug);
        setName(data.name);
        setType(data.type);
        setSerial(data.serial);
        setLoadCell(data.loadCell);
        setiDay(curDate);
        setNameCus(data.namCus);
        setAddress(data.address);
        setPhone(data.phone);
        setTime(data.time);
        setsDay(data.sDay);
        seteDay(data.eDay);
        setEnable(data.enable);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [productId]);

  const submitHandler = async (e) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(`/api/products/${productId}`, {
        _id: productId,
        slug,
        name,
        type,
        serial,
        loadCell,
        iDay,
        nameCus,
        address,
        phone,
        time,
        sDay,
        eDay,
        enable: '1',
      });
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Kích hoạt thành công');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  const child = <ProductEditScreen2 />;
  if (enable === '0')
    return (
      <>
        <Container className="small-container">
          <div className="desktop-form">
            <Helmet>
              <title>Bảo Hành Quốc Hưng</title>
            </Helmet>
            <Form onSubmit={submitHandler} id="form">
              <h3>📋BIỂU MẪU NHẬP LIỆU – LẮP ĐẶT CÂN</h3>
              <Form.Group className="mb-3 hidden" controlId="slug">
                <Form.Control
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="name">
                <FloatingLabel
                  controlId="floatingTextarea"
                  label="Người thực hiện"
                  className="mb-3">
                  <Form.Control
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mb-3" controlId="type">
                <FloatingLabel
                  controlId="floatingTextarea"
                  label="Hãng/ Loại đầu cân"
                  className="mb-3">
                  <Form.Control
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mb-3" controlId="serial">
                <FloatingLabel
                  controlId="floatingTextarea"
                  label="Serial"
                  className="mb-3">
                  <Form.Control
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mb-3" controlId="loadCell">
                <FloatingLabel
                  controlId="floatingTextarea"
                  label="LoadCell"
                  className="mb-3">
                  <Form.Control
                    value={loadCell}
                    onChange={(e) => setLoadCell(e.target.value)}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mb-3 hidden" controlId="iDay">
                <Form.Label>Ngày lắp đặt</Form.Label>
                <Form.Control
                  value={curDate}
                  onChange={(e) => setiDay(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3 hidden" controlId="enable">
                <Form.Label>Enable</Form.Label>
                <Form.Control
                  value={enable}
                  onChange={(e) => setEnable(e.target.value)}
                />
              </Form.Group>
              <div className="mb-3">
                <Button
                  disabled={
                    (loadingUpdate && !name) || !type || !serial || !loadCell
                  }
                  type="submit">
                  Kích hoạt
                </Button>
                {loadingUpdate && <LoadingBox></LoadingBox>}
              </div>
            </Form>
          </div>
          <div className="mobile-form">
            <Helmet>
              <title>Bảo Hành Quốc Hưng</title>
            </Helmet>
            <Form onSubmit={submitHandler} id="form">
              <h5>📋BIỂU MẪU NHẬP LIỆU – LẮP ĐẶT CÂN</h5>
              <Form.Group className="mb-3 hidden" controlId="slug">
                <Form.Control
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="name">
                <FloatingLabel
                  controlId="floatingTextarea"
                  label="Người thực hiện"
                  className="mb-3">
                  <Form.Control
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mb-3" controlId="type">
                <FloatingLabel
                  controlId="floatingTextarea"
                  label="Hãng/ Loại đầu cân"
                  className="mb-3">
                  <Form.Control
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mb-3" controlId="serial">
                <FloatingLabel
                  controlId="floatingTextarea"
                  label="Serial"
                  className="mb-3">
                  <Form.Control
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mb-3" controlId="loadCell">
                <FloatingLabel
                  controlId="floatingTextarea"
                  label="LoadCell"
                  className="mb-3">
                  <Form.Control
                    value={loadCell}
                    onChange={(e) => setLoadCell(e.target.value)}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mb-3 hidden" controlId="iDay">
                <Form.Label>Thời hạn bảo hành</Form.Label>
                <Form.Control
                  value={curDate}
                  onChange={(e) => setiDay(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3 hidden" controlId="enable">
                <Form.Label>Enable</Form.Label>
                <Form.Control
                  value={enable}
                  onChange={(e) => setEnable(e.target.value)}
                />
              </Form.Group>
              <div className="mb-3">
                <Button
                  disabled={
                    (loadingUpdate && !name) || !type || !serial || !loadCell
                  }
                  type="submit">
                  Kích hoạt
                </Button>
                {loadingUpdate && <LoadingBox></LoadingBox>}
              </div>
            </Form>
          </div>
        </Container>
      </>
    );

  return child;
}
