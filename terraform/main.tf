terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.29.0"
    }
  }
}

provider "aws" {
  region = "ap-northeast-2"

  default_tags {
    tags = {
      Name = local.name
    }
  }
}

# cloudfront용 waf에서만 global provider(= us-east-1)를 사용
# api gateway는 regional로 생성하기 때문에 global을 사용할 필요가 없음
provider "aws" {
  alias = "global"
  region = "us-east-1"

  default_tags {
    tags = {
      Name = local.name
    }
  }
}

locals {
  name = "fmarket"
  s3_origin_id = "fmarket_s3_origin"

  # TODO: 아래 있는 값은 변경해서 사용해주세요
  # 본인ID(email)을 사용해주세요. 중복될 경우 리소스 생성에 지장이 있습니다
  uid = "gnidoc327"

  # 본인IP를 넣으세요. IP확인(https://www.myip.com/)
  myips = [
    "183.101.243.112/32"
  ]

  # API Gateway의 API ID값을 넣으세요.(리소스ID X)
  api_gateway_id = ""
}
