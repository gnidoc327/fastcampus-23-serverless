import {
  Button,
  Form,
  Input,
  InputNumber,
  Upload,
  Typography,
  message,
} from 'antd';
import _ from 'lodash';
import {instance} from '../../api';
import {useNavigate} from 'react-router-dom';

const {Title} = Typography;

const fileTypes = [
  'image/apng',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/pjpeg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'image/webp',
  'image/x-icon',
];

const GoodsRegister = () => {
  const navigate = useNavigate();
  return (
    <>
      <Title>상품 등록 페이지</Title>
      <Form
        onFinish={async (values) => {
          const formData = new FormData();
          const jsonData = JSON.stringify({
            name: values.title,
            description: values.description,
            price: values.price,
          });
          formData.append(
            'goodsItemDto',
            new Blob([jsonData], {
              type: 'application/json',
            })
          );
          formData.append('file', values.image.file);

          await instance({
            method: 'POST',
            url: '/good-items',
            headers: {'Content-Type': 'multipart/form-data'},
            data: formData,
          });
          message.info('상품이 등록되었습니다');
          navigate('/');
        }}
      >
        <Form.Item name={'title'} label="상품명">
          <Input />
        </Form.Item>
        <Form.Item name={'description'} label="설명">
          <Input />
        </Form.Item>
        <Form.Item name={'price'} label="가격">
          <InputNumber
            style={{textAlign: 'right'}}
            addonAfter={'원'}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
          />
        </Form.Item>
        <Form.Item name={'image'} label="상품 설명 이미지">
          <Upload
            name="image"
            listType="picture"
            accept={_.join(fileTypes, ', ')}
            maxCount={1}
            beforeUpload={() => false}
          >
            <Button>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item wrapperCol={{offset: 8, span: 16}}>
          <Button type="primary" htmlType="submit">
            상품 등록
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default GoodsRegister;
