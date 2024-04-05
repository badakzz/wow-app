terraform {
  backend "s3" {
    bucket  = "wow-app-terraform-state"
    encrypt = true
    key     = "terraform-setup/terraform.tfstate"
    region  = "eu-west-3"

    role_arn       = "arn:aws:iam::637423496590:role/admin"
    dynamodb_table = "terraform-state-lock"
  }
}
