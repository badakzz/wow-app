resource "aws_s3_bucket" "terraform-state" {
  bucket = "${var.name_prefix}-terraform-state"
  lifecycle {
    prevent_destroy = true
  }
  tags = var.tags
}

resource "aws_s3_bucket_public_access_block" "terraform-state-public-access-block" {
  bucket                  = aws_s3_bucket.terraform-state.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
