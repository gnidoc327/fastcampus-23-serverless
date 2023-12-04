resource "aws_wafv2_ip_set" "frontend" {
  provider    = aws.global
  name        = "frontend-access-ip-set"
  description = "for myips"
  scope       = "CLOUDFRONT"

  ip_address_version = "IPV4"
  addresses          = concat(local.myips)
}

resource "aws_wafv2_web_acl" "frontend" {
  provider    = aws.global
  name        = "frontend-access-allow-web-acl"
  description = "for myips"
  scope       = "CLOUDFRONT"

  default_action {
    block {}
  }

  rule {
    name     = "frontend-allow-ip-rule"
    priority = 1

    action {
      allow {}
    }

    statement {
      ip_set_reference_statement {
        arn = aws_wafv2_ip_set.frontend.arn
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "frontend-access-allow-web-acl"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "frontend-access-deny-web-acl"
    sampled_requests_enabled   = true
  }
}

resource "aws_wafv2_ip_set" "backend" {
  name        = "backend-access-ip-set"
  description = "for myips"
  scope       = "REGIONAL"

  ip_address_version = "IPV4"
  addresses          = concat(local.myips)
}

resource "aws_wafv2_web_acl" "backend" {
  name        = "backend-access-allow-web-acl"
  description = "for myips"
  scope       = "REGIONAL"

  default_action {
    block {}
  }

  rule {
    name     = "backend-allow-ip-rule"
    priority = 1

    action {
      allow {}
    }

    statement {
      ip_set_reference_statement {
        arn = aws_wafv2_ip_set.backend.arn
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "backend-access-allow-web-acl"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "backend-access-deny-web-acl"
    sampled_requests_enabled   = true
  }
}

resource "aws_wafv2_web_acl_association" "backend_stage" {
  count = local.api_gateway_id == "" ? 0 : 1
  resource_arn = "arn:aws:apigateway:ap-northeast-2::/restapis/${local.api_gateway_id}/stages/Stage"
  web_acl_arn  = aws_wafv2_web_acl.backend.arn
}

resource "aws_wafv2_web_acl_association" "backend_prod" {
  count = local.api_gateway_id == "" ? 0 : 1
  resource_arn = "arn:aws:apigateway:ap-northeast-2::/restapis/${local.api_gateway_id}/stages/prod"
  web_acl_arn  = aws_wafv2_web_acl.backend.arn
}

