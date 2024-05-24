resource "aws_security_group" "lambda_sg" {
  name        = "lambda-security-group"
  description = "Security group for Lambda function"
  vpc_id      = data.terraform_remote_state.central.outputs.main_vpc_id

  egress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group_rule" "allow_lambda_to_rds" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = data.terraform_remote_state.central.outputs.rds_sg_id
  source_security_group_id = aws_security_group.lambda_sg.id
  description              = "Allow access from Lambda to RDS"
}
