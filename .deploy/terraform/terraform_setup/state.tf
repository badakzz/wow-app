terraform {
  backend "s3" {
    bucket  = "badak-terraform-states"
    encrypt = true
    key     = "wow-app/terraform.tfstate"
    region  = "eu-west-3"

    role_arn       = "arn:aws:iam::637423496590:role/admin"
    dynamodb_table = "terraform-state-lock"
  }
}
