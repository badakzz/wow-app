resource "aws_kms_key" "kms-key-db" {
  description             = "KMS key to encrypt master pw"
  deletion_window_in_days = 10
}

resource "aws_kms_alias" "kms-key-db-alias" {
  name          = "alias/kms-key-db"
  target_key_id = aws_kms_key.kms-key-db.id
}

module "db" {
  source = "terraform-aws-modules/rds/aws"

  identifier = "wow-app-db"

  engine            = "postgres"
  engine_version    = "14"
  instance_class    = "db.t3.micro"
  allocated_storage = 5

  db_name  = "WowAppDb"
  username = "WowAppAdm"
  port     = "5432"

  manage_master_user_password = false

  password = data.sops_file.secrets.data["masterUserDbPw"]

  vpc_security_group_ids = [aws_security_group.rds_sg.id]

  maintenance_window = "Mon:00:00-Mon:03:00"
  backup_window      = "03:00-06:00"

  create_db_subnet_group = true
  subnet_ids             = [data.terraform_remote_state.central.outputs.rds_subnet_a_id, data.terraform_remote_state.central.outputs.rds_subnet_b_id]

  family = "postgres14"

  major_engine_version = "14"

  deletion_protection = true

  master_user_secret_kms_key_id = aws_kms_key.kms-key-db.id

  publicly_accessible = true

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
}