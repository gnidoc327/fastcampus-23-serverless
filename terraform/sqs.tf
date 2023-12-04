# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/sqs_queue
resource "aws_sqs_queue" "default" {
  name          = local.name
  delay_seconds = 0
  # 보관 기간에 대한 비용은 없으므로 최대치인 14일로 지정
  message_retention_seconds = 1209600
}
