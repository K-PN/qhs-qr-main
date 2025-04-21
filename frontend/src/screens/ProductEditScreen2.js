import React, { useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../utils';
import Container from 'react-bootstrap/Container';
import { Helmet } from 'react-helmet-async';
import ProductEditScreen3 from './ProductEditScreen3';

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

const today = new Date();
const curDate =
  today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();

const expDate =
  today.getDate() + '-' + (today.getMonth() + 7) + '-' + today.getFullYear();
export default function ProductEditScreen2() {
  const params = useParams(); // /product/:id
  const { id: productId } = params;

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [serial, setSerial] = useState('');
  const [serialCell, setSerialCell] = useState('');
  const [serialCell2, setSerialCell2] = useState('');
  const [serialCell3, setSerialCell3] = useState('');
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
        setName(data.name);
        setType(data.type);
        setSerial(data.serial);
        setSerialCell(data.serialCell);
        setSerialCell2(data.serialCell2);
        setSerialCell3(data.serialCell3);
        setiDay(data.iDay);
        setNameCus(data.namCus);
        setAddress(data.address);
        setPhone(data.phone);
        setTime(data.time);
        setsDay(curDate);
        seteDay(expDate);
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

  const child2 = <ProductEditScreen3 />;
  if (enable === '2')
    return (
      <>
        <Container className="small-container">
          <div className="desktop-form">
            <Helmet>
              <title>Bảo Hành Quốc Hưng</title>
            </Helmet>
            <div className="done">
              <div className="content">
                <h3>THÔNG TIN SẢN PHẨM</h3>
                <div className="row">
                  <div className="col-xs-6 col-md-3">
                    <span className="txt1">Sản phẩm:</span>
                  </div>
                  <div className="col-xs-6 col-md-3">
                    <p>{type}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-6 col-md-3">
                    <span className="txt1">Thời hạn bảo hành:</span>
                  </div>
                  <div className="col-xs-6 col-md-3">
                    <p>{time} tháng</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-6 col-md-3">
                    <span className="txt1">Ngày kích hoạt:</span>
                  </div>
                  <div className="col-xs-6 col-md-3">
                    <p>{sDay}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-6 col-md-3">
                    <span className="txt1">Ngày hết hạn:</span>
                  </div>
                  <div className="col-xs-6 col-md-3">
                    <p>{eDay}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-6 col-md-3">
                    <span className="txt1">Điện thoại kích hoạt:</span>
                  </div>
                  <div className="col-xs-6 col-md-3">
                    <p>{phone}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-6 col-md-3">
                    <span className="txt1">Họ tên khách hàng:</span>
                  </div>
                  <div className="col-xs-6 col-md-3">
                    <p>{nameCus}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-6 col-md-3">
                    <span className="txt1">Địa chỉ khách hàng:</span>
                  </div>
                  <div className="col-xs-6 col-md-3">
                    <p>{address}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-6 col-md-3">
                    <span className="txt1">Serial:</span>
                  </div>
                  <div className="col-xs-6 col-md-3">
                    <p>{serial}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mobile-form">
            <Helmet>
              <title>Bảo Hành Quốc Hưng</title>
            </Helmet>
            <div className="content">
              <div className="title">
                <img src="../images/shield.png" width={50} alt="shield" />
                Thông tin bảo hành
              </div>
              <div className="info">
                <div className="row">
                  <span className="txt1">
                    • Sản phẩm:<p>{type}</p>
                  </span>
                </div>
                <div className="row">
                  <span className="txt1">
                    • Thời hạn bảo hành:<p>{time} tháng</p>
                  </span>
                </div>
                <div className="row">
                  <span className="txt1">
                    • Ngày kích hoạt:<p>{sDay}</p>
                  </span>
                </div>
                <div className="row">
                  <span className="txt1">
                    • Ngày hết hạn:<p>{eDay}</p>
                  </span>
                </div>
                <div className="row">
                  <span className="txt1">
                    • Điện thoại kích hoạt:<p>{phone}</p>
                  </span>
                </div>
                <div className="row">
                  <span className="txt1">
                    • Họ tên khách hàng:<p>{nameCus}</p>
                  </span>
                </div>
                <div className="row">
                  <span className="txt1">
                    • Serial:<p>{serial}</p>
                  </span>
                </div>
              </div>
            </div>
            <h6></h6>
            <div className="content">
              <div className="title">
                <img src="../images/repair.png" width={28} alt="repair" />
                Sửa chữa cân điện tử 24h
              </div>
              <div className="info">
                <div className="row">
                  <span className="txt2">
                    • Đăk Lăk: <p>0869 03 1468</p>
                  </span>
                </div>
                <div className="row">
                  <span className="txt2">
                    • Đăk Nông: <p>0868 571 468</p>
                  </span>
                </div>
                <div className="row">
                  <span className="txt2">
                    • Lâm Đồng: <p>0862 690 468</p>
                  </span>
                </div>
                <div className="row">
                  <span className="txt2">
                    • Gia Lai - Kon Tum: <p>0965 015 468</p>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </>
    );
  return child2;
}
