import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

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
export default function ProductEditScreenAd() {
  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: productId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [serial, setSerial] = useState('');
  const [serialCell, setSerialCell] = useState('');
  const [serialCell2, setSerialCell2] = useState('');
  const [serialCell3, setSerialCell3] = useState('');
  const [iDay, setiDay] = useState('');
  const [nameCus, setNameCus] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [time, setTime] = useState('');
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
        setSerialCell(data.serialCell);
        setSerialCell2(data.serialCell2);
        setSerialCell3(data.serialCell3);
        setiDay(data.iDay);
        setNameCus(data.nameCus);
        setPhone(data.phone);
        setAddress(data.address);
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
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(`/api/products/${productId}`, {
        _id: productId,
        slug,
        name,
        type,
        serial,
        serialCell,
        serialCell2,
        serialCell3,
        iDay,
        nameCus,
        phone,
        address,
        time,
        sDay,
        eDay,
        enable,
      });
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Kích hoạt thành công');
      navigate('/admin/qr');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  const [isActive, setIsActive] = useState(false);

  const handleClick = (event) => {
    setIsActive((current) => !current);
  };
  return (
    <Container className="small-container">
      <div className="desktop-formAd">
        <Helmet>
          <title>Bảo Hành Quốc Hưng</title>
        </Helmet>

        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Form
            onSubmit={submitHandler}
            className={isActive ? 'hidden' : ''}
            id="form">
            <h3>THÊM PHIẾU BẢO HÀNH</h3>
            <Form.Group className="mb-3 hidden" controlId="slug">
              <Form.Control
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Họ và Tên"
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
                label="Hãng/Loại đầu cân"
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
                label="Số Seri đầu cân"
                className="mb-3">
                <Form.Control
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="serialCell">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Số Seri Loadcell 1"
                className="mb-3">
                <Form.Control
                  value={serialCell}
                  onChange={(e) => setSerialCell(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="serialCell2">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Số Seri Loadcell 2"
                className="mb-3">
                <Form.Control
                  value={serialCell2}
                  onChange={(e) => setSerialCell2(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="serialCell3">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Số Seri Loadcell 3"
                className="mb-3">
                <Form.Control
                  value={serialCell3}
                  onChange={(e) => setSerialCell3(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="iDay">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Ngày lắp ráp"
                className="mb-3">
                <Form.Control
                  value={iDay}
                  onChange={(e) => setiDay(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="nameCus">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Họ và tên"
                className="mb-3">
                <Form.Control
                  value={nameCus}
                  onChange={(e) => setNameCus(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="phone">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Số điện thoại"
                className="mb-3">
                <Form.Control
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="address">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Địa Chỉ"
                className="mb-3">
                <Form.Control
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="time">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Thời hạn bảo hành"
                className="mb-3">
                <Form.Control
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="sDay">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Ngày kích hoạt"
                className="mb-3">
                <Form.Control
                  value={sDay}
                  onChange={(e) => setsDay(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="eDay">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Ngày hết hạn"
                className="mb-3">
                <Form.Control
                  value={eDay}
                  onChange={(e) => seteDay(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <div className="mb-3">
              <Button
                disabled={loadingUpdate}
                type="submit"
                onClick={handleClick}>
                Kích hoạt
              </Button>
              {loadingUpdate && <LoadingBox></LoadingBox>}
            </div>
          </Form>
        )}
      </div>
      <div className="mobile-formAd">
        <Helmet>
          <title>Bảo Hành Quốc Hưng</title>
        </Helmet>

        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Form
            onSubmit={submitHandler}
            className={isActive ? 'hidden' : ''}
            id="formAd">
            <h5>CHỈNH SỬA</h5>
            <Form.Group className="mb-3 hidden" controlId="slug">
              <Form.Control
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Họ và Tên"
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
                label="Hãng/Loại đầu cân"
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
                label="Số Seri đầu cân"
                className="mb-3">
                <Form.Control
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="serialCell">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Số Seri Loadcell 1"
                className="mb-3">
                <Form.Control
                  value={serialCell}
                  onChange={(e) => setSerialCell(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="serialCell2">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Số Seri Loadcell 2"
                className="mb-3">
                <Form.Control
                  value={serialCell2}
                  onChange={(e) => setSerialCell2(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="serialCell3">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Số Seri Loadcell 3"
                className="mb-3">
                <Form.Control
                  value={serialCell3}
                  onChange={(e) => setSerialCell3(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="iDay">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Ngày lắp ráp"
                className="mb-3">
                <Form.Control
                  value={iDay}
                  onChange={(e) => setiDay(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="nameCus">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Họ và tên"
                className="mb-3">
                <Form.Control
                  value={nameCus}
                  onChange={(e) => setNameCus(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="phone">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Số điện thoại"
                className="mb-3">
                <Form.Control
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="address">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Địa Chỉ"
                className="mb-3">
                <Form.Control
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="time">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Thời hạn bảo hành"
                className="mb-3">
                <Form.Control
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="sDay">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Ngày kích hoạt"
                className="mb-3">
                <Form.Control
                  value={sDay}
                  onChange={(e) => setsDay(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="eDay">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Ngày hết hạn"
                className="mb-3">
                <Form.Control
                  value={eDay}
                  onChange={(e) => seteDay(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <div className="mb-3">
              <Button
                disabled={loadingUpdate}
                type="submit"
                onClick={handleClick}>
                Kích hoạt
              </Button>
              {loadingUpdate && <LoadingBox></LoadingBox>}
            </div>
          </Form>
        )}
      </div>
    </Container>
  );
}
