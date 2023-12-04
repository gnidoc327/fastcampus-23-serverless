#https://registry.terraform.io/modules/terraform-aws-modules/rds-aurora/aws/8.5.0
module "aurora_mysql_v2" {
  source  = "terraform-aws-modules/rds-aurora/aws"
  version = "8.5.0"

  name                        = local.name
  engine                      = "aurora-mysql"
  engine_mode                 = "provisioned"
  engine_version              = "8.0"
  storage_encrypted           = true
  manage_master_user_password = false
  master_username             = local.name
  master_password             = "${local.name}1!"

  vpc_id               = module.vpc.vpc_id
  db_subnet_group_name = module.vpc.database_subnet_group_name
  security_group_rules = {
    private_ingress = {
      cidr_blocks = module.vpc.private_subnets_cidr_blocks
    }
    public_ingress = {
      cidr_blocks = module.vpc.public_subnets_cidr_blocks
    }
  }

  monitoring_interval = 5

  apply_immediately   = true
  skip_final_snapshot = true

  serverlessv2_scaling_configuration = {
    min_capacity = 0.5
    max_capacity = 10
  }

  instance_class = "db.serverless"
  instances = {
    one = {}
  }
}
