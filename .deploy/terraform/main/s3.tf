module "s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "4.1.1"

  bucket = "wow-app-db"
  acl    = "private"

  control_object_ownership = true
  object_ownership         = "ObjectWriter"

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_object" "db-items-csv-dump" {
  bucket = module.s3_bucket.s3_bucket_id
  key    = "items.csv"
  source = "../../../database/dumps/items.csv"

  etag = filemd5("../../../database/dumps/items.csv")
}


resource "aws_s3_object" "db-prices_history-csv-dump" {
  bucket = module.s3_bucket.s3_bucket_id
  key    = "prices_history.csv"
  source = "../../../database/dumps/prices_history.csv"

  etag = filemd5("../../../database/dumps/prices_history.csv")
}
