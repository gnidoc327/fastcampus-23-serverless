import datetime

import boto3
import requests
from requests.auth import HTTPBasicAuth

# TODO: 아래 값을 적절하게 수정하세요
OPENSEARCH_HOST = 'https://localhost:9200'
DB_HOST = 'localhost'

OPENSEARCH_USER = "fmarket"
OPENSEARCH_PASSWORD = "Fmarket1!"

DB_NAME = 'fmarket'
DB_USER = 'fmarket'
DB_PASSWORD = 'fmarket1!'

ddb = boto3.client('dynamodb')
auth = HTTPBasicAuth(OPENSEARCH_USER, OPENSEARCH_PASSWORD)


def analyze_text_list(text_list: list[str]) -> list[str]:
    res = requests.post(f"{OPENSEARCH_HOST}/fmarket/_analyze", auth=auth, verify=False,
                        headers={
                            'Content-Type': 'application/json'
                        },
                        json={
                            "analyzer": "korean",
                            "text": text_list
                        })
    tokens = set()
    for item in res.json().get('tokens', []):
        token = item.get('token', '').split('/')[0]
        tokens.add(token)
    return list(tokens)


def search(keywords: list[str]) -> list[int]:
    should_items = []
    for keyword in keywords:
        should_items.append({"match": {"name": keyword}})
        should_items.append({"match": {"description": keyword}})

    query = {
        "_source": ["id"],
        "query": {
            "bool": {
                "should": should_items[:20]
            }
        }
    }
    res = requests.post(f"{OPENSEARCH_HOST}/fmarket/_search", auth=auth, verify=False,
                        headers={
                            'Content-Type': 'application/json'
                        },
                        json=query)
    return [item.get("_id") for item in res.json().get('hits', {}).get('hits', [])]


def lambda_handler(event: dict):
    keyword = event.get('keyword')
    today = datetime.datetime.today()
    last_month = today - datetime.timedelta(days=30)
    res = ddb.query(
        TableName='purchase-history',
        ExpressionAttributeValues={
            ':user_id': {
                'S': f"{event.get('user_id', 0)}"
            },
            ':created_at': {
                'N': f'{int(last_month.timestamp())}'
            }
        },
        KeyConditionExpression='user_id = :user_id AND created_at >= :created_at',
        ExpressionAttributeNames={
            "#name": "name"
        },
        ProjectionExpression='user_id,created_at,#name,description,goods_item_id',
        ScanIndexForward=False,
        Limit=10
    )
    items = res['Items']
    keyword_data = set()
    for item in items:
        name = item.get('name', {}).get('S', '')
        description = item.get('description', {}).get('S', '')
        text_list = [name, description]
        keyword_data.update(list(analyze_text_list(text_list)))
    keyword_data.add(keyword)
    return search(list(keyword_data))
