import {Layout, Input, Button, Spin, message} from 'antd';
import {Outlet, Route, Routes, useNavigate} from 'react-router-dom';
import Home from './component/Home';
import NotFound from './component/ErrorPage/notFound';
import GoodsDetail from './component/GoodsDetail';
import {useRecoilState, useRecoilValue} from 'recoil';
import {searchKeywordState} from './recoil/searchKeyword';
import Login from './component/Login';
import {getAccessToken} from './util/cookie';
import _ from 'lodash';
import {CSSProperties, useEffect, useState} from 'react';
import {isLoginState} from './recoil/auth';
import {useLocalData} from './api';
import GoodsRegister from './component/GoodsRegister';
import NotificationHistoryList from './component/NotificationHistoryList';
import PurchaseHistoryList from './component/PurchaseHistoryList';
import NotificationHistoryDetail from './component/NotificationHistoryDetail';
import PurchaseHistoryDetail from './component/PurchaseHistoryDetail';

const {Header, Content, Footer} = Layout;
const {Search} = Input;

export const BASE_RED_COLOR = '#E83B4F';

const buttonStyle: CSSProperties = {
  marginLeft: 20,
};

const App = () => {
  const [, setSearchKeyword] = useRecoilState(searchKeywordState);
  const isLogin = useRecoilValue(isLoginState);
  const navigate = useNavigate();

  const loginButton = isLogin ? (
    <></>
  ) : (
    <Button
      onClick={() => {
        navigate('/login');
      }}
    >
      로그인/회원가입
    </Button>
  );

  return (
    <Layout style={{width: 1000, margin: 'auto'}}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          background: BASE_RED_COLOR,
        }}
      >
        <div
          style={{color: 'white', fontSize: 30}}
          onClick={() => navigate('/')}
        >
          Fmarket
        </div>
        <Search
          placeholder="키워드 검색(ex - 국밥)"
          style={{marginLeft: 50, marginRight: 50}}
          onSearch={(value) => {
            setSearchKeyword(value);
            navigate('/');
          }}
        />
        {loginButton}
        <Button
          style={buttonStyle}
          onClick={() => {
            navigate('/goods/register');
          }}
        >
          상품등록
        </Button>
        <Button
          style={buttonStyle}
          onClick={() => {
            navigate('/notification-list');
          }}
        >
          알림이력
        </Button>
        <Button
          style={buttonStyle}
          onClick={() => {
            navigate('/purchase-list');
          }}
        >
          구매이력
        </Button>
      </Header>
      <Content style={{padding: '20px', height: '100%', margin: 'auto'}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/goods/:id" element={<GoodsDetail />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/goods/register" element={<GoodsRegister />} />
            <Route
              path="/notification-list"
              element={<NotificationHistoryList />}
            />
            <Route
              path="/notification-list/:id"
              element={<NotificationHistoryDetail />}
            />
            <Route path="/purchase-list" element={<PurchaseHistoryList />} />
            <Route
              path="/purchase-list/:id"
              element={<PurchaseHistoryDetail />}
            />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Content>
      <Footer style={{textAlign: 'center'}}></Footer>
    </Layout>
  );
};

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useRecoilState(isLoginState);
  const [spinning, setSpinning] = useState<boolean>(false);

  useEffect(() => {
    if (useLocalData) {
      setIsLogin(true);
      return;
    }
    setSpinning(true);
    const token = getAccessToken();
    const base64Url = _.nth(_.split(token, '.'), 1);
    if (!base64Url) {
      setIsLogin(false);
      navigate('/login', {replace: true});
      return;
    }
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      _.map(atob(base64).split(''), (c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );

    const decodedToken = JSON.parse(jsonPayload);
    if (new Date(decodedToken.exp * 1000) > new Date()) {
      message.info({
        key: 'login-check-success',
        content: '로그인 인증 확인',
      });
      setIsLogin(true);
    } else {
      message.error({
        key: 'login-check-fail',
        content: '로그인 인증 실패. 로그인 페이지로 이동합니다',
      });
      setIsLogin(false);
      navigate('/login', {replace: true});
    }
  }, []);

  if (isLogin) {
    return <Outlet />;
  }

  return (
    <Spin spinning={spinning} size="large" tip={'인증 확인 중'}>
      <div className="content" />
    </Spin>
  );
};

export default App;
