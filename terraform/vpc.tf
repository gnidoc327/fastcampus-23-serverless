# https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/5.4.0
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.4.0"

  name = local.name
  cidr = "10.0.0.0/16"

  azs             = ["ap-northeast-2a", "ap-northeast-2c", "ap-northeast-2b"]
  private_subnets = ["10.0.0.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.3.0/24", "10.0.4.0/24"]

  create_database_subnet_group = true
  database_subnets             = ["10.0.5.0/24", "10.0.6.0/24"]

  create_elasticache_subnet_group = true
  elasticache_subnets             = ["10.0.7.0/24", "10.0.8.0/24", "10.0.9.0/24"]

  single_nat_gateway = true
  enable_nat_gateway = true

  default_security_group_ingress = concat(flatten([
    for port in toset([22, 3000, 5000, 8080, 8089]) : [
      for myip in local.myips : {
        from_port   = port
        to_port     = port
        protocol    = "tcp"
        description = "for myips"
        cidr_blocks = myip
      }
    ]
  ]), [
    {
      from_port   = 443
      to_port     = 443
      protocol    = "tcp"
      description = "opensearch"
      cidr_blocks = "10.0.0.0/16"
    }
  ])

  default_security_group_egress = [
    {
      from_port   = 0
      to_port     = 0
      protocol    = -1
      description = ""
      cidr_blocks = "0.0.0.0/0"
    }
  ]

  tags = {
    Terraform = "true"
  }
}
