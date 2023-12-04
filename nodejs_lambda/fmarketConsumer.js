const mysql = require('mysql2/promise');
const axios = require('axios');
const AWS = require('aws-sdk');

// TODO: 정보를 본인 계정에 맞게 변경
const mysqlHost =
  'fmarket.cluster-c9piytoc4vtx.ap-northeast-2.rds.amazonaws.com';
const openSearchHost =
  'https://vpc-fmarket-znt3kjbc5nszf3eib44pxdlwva.ap-northeast-2.es.amazonaws.com'; // OpenSearch 호스트 주소
const verifyEmail = 'gnidoc327@gmail.com';
const sendMailOff = true;

// AWS SES 설정
const ses = new AWS.SES({
  region: 'ap-northeast-2',
});

// MySQL 연결 정보
const connectionConfig = {
  host: mysqlHost,
  user: 'fmarket',
  password: 'fmarket1!',
  database: 'fmarket',
};

// OpenSearch 연결 정보
const openSearchIndex = 'goods-item'; // 인덱스 이름
const openSearchUrl = `${openSearchHost}`;
const axiosConfig = {
  auth: {
    username: 'fmarket',
    password: 'Fmarket1!',
  },
};

// Lambda 핸들러 함수
exports.handler = async (event) => {
  console.log('event= ', event);
  if (!event.Records) {
    return 'Not Exists Message';
  }

  for (const record of event.Records) {
    await processMessage(record.body);
  }
  return 'Success Processing For Message';
};

const processMessage = async (message) => {
  // message = "goodsItemId/username" => EX) "1/gnidoc"
  const goodsItemId = message.split('/')[0];
  const username = message.split('/')[1];

  // MySQL 쿼리
  const queryString = 'SELECT * FROM goods_item WHERE id = ?';
  const connection = await mysql.createConnection(connectionConfig);

  const [rows] = await connection.execute(queryString, [goodsItemId]);
  if (rows.length == 0) {
    throw error;
  }

  const goodsItem = rows[0];
  const openSearchRes = await axios.post(
    `${openSearchUrl}/fmarket/_doc/${goodsItem.id}`,
    goodsItem,
    axiosConfig
  );
  console.log('openSearchRes=', openSearchRes);

  const subject = `Fmarket 상품 등록 알림(${username})`;
  const body = `상품명: ${goodsItem.name}\n상품정보: ${goodsItem.description}`;
  const sendMailRes = await sendMail(subject, body);
  console.log('sendMailRes=', sendMailRes);
  await connection.end();
};

const sendMail = async (subject, body) => {
  if (sendMailOff) {
    return 'Success';
  }
  // 이메일 속성 설정
  const params = {
    Destination: {
      ToAddresses: [verifyEmail], // 수신자 이메일 주소
    },
    Message: {
      Body: {
        Text: {
          Data: body, // 이메일 내용
          Charset: 'UTF-8',
        },
      },
      Subject: {
        Data: subject, // 이메일 제목
        Charset: 'UTF-8',
      },
    },
    Source: verifyEmail, // 발신자 이메일 주소
  };
  await ses
    .sendEmail(params)
    .promise()
    .then((res) => {
      return `Success to ${res.MessageId}`;
    })
    .catch((err) => {
      return 'Error';
    });
  return 'Success';
};
