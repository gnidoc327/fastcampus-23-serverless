module "notify_slack" {
  #  TODO: count를 1로 바꾸고 slack webhook url을 생성하세요
  slack_webhook_url = ""
  slack_channel     = ""
  count = 0

  source  = "terraform-aws-modules/notify-slack/aws"
  version = "6.1.0"

  sns_topic_name = "fmarket-notification"
  slack_username    = "fmarket"
}
