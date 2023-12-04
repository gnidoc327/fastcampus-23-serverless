resource "aws_instance" "bastion" {
  ami = "ami-0bfd23bc25c60d5a1"
  # 필요시 다른 intel 타입으로 변경 가능
  instance_type = "m7i.2xlarge"

  subnet_id                   = module.vpc.public_subnets[0]
  iam_instance_profile        = aws_iam_instance_profile.default.name
  key_name                    = local.name
  monitoring                  = true
  associate_public_ip_address = true
  hibernation                 = false

  root_block_device {
    volume_size = 100
    volume_type = "gp3"
    encrypted   = true
  }

  tags = {
    Name = local.name
  }
}

resource "aws_iam_instance_profile" "default" {
  name = local.name
  role = aws_iam_role.ec2.name
}

resource "aws_eip" "bastion" {
  domain   = "vpc"
  instance = aws_instance.bastion.id
}
