# https://registry.terraform.io/modules/terraform-aws-modules/s3-bucket/aws/3.15.1
module "s3_list" {
  for_each = toset([
    "react-project-${local.uid}",
    "fmarket-profile-${local.uid}",
    "fmarket-goods-${local.uid}",
    "lambda-package-${local.uid}"
  ])
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "3.15.1"

  bucket = each.key
  acl    = "private"

  control_object_ownership = true
  object_ownership         = "ObjectWriter"

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }
}

data "aws_iam_policy_document" "frontend_s3_policy" {
  statement {
    actions = ["s3:GetObject"]
    resources = [
      "${module.s3_list["react-project-${local.uid}"].s3_bucket_arn}/*"
    ]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.s3_origin_access_identity.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "frontend" {
  bucket = module.s3_list["react-project-${local.uid}"].s3_bucket_id
  policy = data.aws_iam_policy_document.frontend_s3_policy.json
}

data "aws_iam_policy_document" "content_s3_policy" {
  statement {
    actions = ["s3:GetObject"]
    resources = [
      "${module.s3_list["fmarket-goods-${local.uid}"].s3_bucket_arn}/*"
    ]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.s3_origin_access_identity.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "content" {
  bucket = module.s3_list["fmarket-goods-${local.uid}"].s3_bucket_id
  policy = data.aws_iam_policy_document.content_s3_policy.json
}
