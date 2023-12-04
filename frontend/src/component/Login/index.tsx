import {Button, Form, Input, message} from 'antd';
import {login} from '../../api/auth';
import _ from 'lodash';
import {useNavigate} from 'react-router-dom';

type FieldType = {
  username?: string;
  password?: string;
};

const Login = () => {
  const navigate = useNavigate();
  return (
    <Form
      name="basic"
      labelCol={{span: 8}}
      wrapperCol={{span: 16}}
      style={{maxWidth: 600}}
      onFinish={async (values) => {
        login(_.get(values, 'username'), _.get(values, 'password'));
        message.success('로그인 성공');
        navigate('/');
      }}
      onFinishFailed={() => {
        message.error('로그인 실패');
      }}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="아이디"
        name="username"
        rules={[{required: true, message: 'Please input your username!'}]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="비밀번호"
        name="password"
        rules={[{required: true, message: 'Please input your password!'}]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{offset: 8, span: 16}}>
        <Button type="primary" htmlType="submit">
          로그인
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
