"""
- 설명: F/E에서 사용하는 STT API에 대해서만 테스트
- 실행: `locust -f locustfile.py --config locust.conf`
"""
import json
import random
import uuid

from locust import task, HttpUser, constant

headers = {
    "accept": "application/json",
    "Content-Type": "application/json"
}


class SearchTest(HttpUser):
    wait_time = constant(5)
    connection_timeout = constant(5)
    json_data = []
    keywords = ["돈까스", "사시미", "고기", "킹크랩", "크랩", "국밥", "라떼"]

    def __init__(self, environment):
        super().__init__(environment)
        self.userId = str(uuid.uuid4())
        with open("../frontend/src/api/goodsData.json", 'r', encoding='utf-8') as file:
            self.json_data = json.load(file)
        self.auth_json = {
            "username": f"test-{self.userId}",
            "password": "1q2w3e4r!!",
        }

    def on_start(self):
        super().on_start()
        item = random.choice(self.json_data)
        self.client.post('/auth/sign-up', headers=headers, json=self.auth_json)
        self.client.post('/auth/login', headers=headers, json=self.auth_json)
        self.client.post('/good-items', headers={
            'Content-Type': 'multipart/form-data'
        }, data={
            'goodsItemDto': {
                'name': item['name'] + '-' + self.userId,
                'description': self.userId + '-' + item['description'],
                'price': item['price']
            }
        }, files={
            'file': open(f'../frontend/public{item["image_url"]}', 'rb')
        })

    @task
    def search_goods(self):
        res = self.client.get(f"/good-items?keyword={random.choice(self.keywords)}", headers=headers)
        items = res.json()
        if items:
            goods_id = random.choice(items)['id']
            self.client.get(f"/good-items/{goods_id}?id={goods_id}", headers=headers)

    @task
    def recommend_goods(self):
        self.client.get(f"/recommanded-goods-items"
                        f"?keyword={self.keywords[random.randrange(0, len(self.keywords))]}&userId={0}",
                        headers=headers)


class PurchaseTest(HttpUser):
    wait_time = constant(10)

    def __init__(self, environment):
        super().__init__(environment)
        res = self.client.get(f"/users", headers=headers)
        users = res.json()
        self.userInfo = random.choice(users)

    @task
    def purchase(self):
        res = self.client.get(f"/good-items", headers=headers)
        item = random.choice(res.json())
        self.client.post(f'/good-items/{item["id"]}', headers=headers, json={
            "userId": self.userInfo,
            "goodsItemId": item["id"],
            "quantity": random.randrange(1, 11)
        })


class HistoryTest(HttpUser):
    wait_time = constant(30)

    def __init__(self, environment):
        super().__init__(environment)
        res = self.client.get(f"/users", headers=headers)
        users = res.json()
        self.userInfo = random.choice(users)

    @task
    def get_history(self):
        self.client.get(f"/purchase-list/{self.userInfo['id']}", headers=headers)
