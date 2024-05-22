
resource "aws_security_group" "ecs_sg" {
  name        = "ecs-security-group"
  description = "Security group for ECS service"
  vpc_id      = data.terraform_remote_state.central.outputs.main_vpc_id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [data.terraform_remote_state.central.outputs.app_sg_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ECS Security Group"
  }
}

resource "aws_security_group" "rds_sg" {
  name        = "rds-security-group"
  description = "Security group for RDS instance to allow HTTP/HTTPS access to S3 and ECS"
  vpc_id      = data.terraform_remote_state.central.outputs.main_vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_sg.id]
    description     = "Allow PostgreSQL connections from ECS tasks"
  }

  egress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow HTTP access to S3"
  }

  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow HTTPS access to S3"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "RDS Security Group"
  }
}

resource "aws_security_group_rule" "allow_local_psql_access" {
  type              = "ingress"
  from_port         = 5432
  to_port           = 5432
  protocol          = "tcp"
  security_group_id = aws_security_group.rds_sg.id
  cidr_blocks       = ["${data.sops_file.secrets.data["localIp"]}/32"]
  description       = "Allow PostgreSQL access from my local machine"
}

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
  security_group_id        = aws_security_group.rds_sg.id
  source_security_group_id = aws_security_group.lambda_sg.id
  description              = "Allow access from Lambda to RDS"
}

/* resource "aws_security_group" "ecs_sg" {
  name        = "ecs-security-group"
  description = "Security group for ECS service"
  vpc_id      = data.terraform_remote_state.central.outputs.main_vpc_id

  tags = {
    Name = "ECS Security Group"
  }
}

resource "aws_security_group_rule" "ecs_allow_app" {
  type                     = "ingress"
  from_port                = 3000
  to_port                  = 3000
  protocol                 = "tcp"
  security_group_id        = aws_security_group.ecs_sg.id
  source_security_group_id = data.terraform_remote_state.central.outputs.app_sg_id
  description              = "Allow traffic from application security group"
}

resource "aws_security_group_rule" "ecs_egress_all" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  security_group_id = aws_security_group.ecs_sg.id
  cidr_blocks       = ["0.0.0.0/0"]
  description       = "Allow all outbound traffic"
}

resource "aws_security_group" "rds_sg" {
  name        = "rds-security-group"
  description = "Security group for RDS instance to allow HTTP/HTTPS access to S3 and ECS"
  vpc_id      = data.terraform_remote_state.central.outputs.main_vpc_id

  tags = {
    Name = "RDS Security Group"
  }
}

resource "aws_security_group_rule" "rds_allow_ecs" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.rds_sg.id
  source_security_group_id = aws_security_group.ecs_sg.id
  description              = "Allow PostgreSQL connections from ECS tasks"
}

resource "aws_security_group_rule" "rds_egress_http" {
  type              = "egress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  security_group_id = aws_security_group.rds_sg.id
  cidr_blocks       = ["0.0.0.0/0"]
  description       = "Allow HTTP access to S3"
}

resource "aws_security_group_rule" "rds_egress_https" {
  type              = "egress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  security_group_id = aws_security_group.rds_sg.id
  cidr_blocks       = ["0.0.0.0/0"]
  description       = "Allow HTTPS access to S3"
}

resource "aws_security_group_rule" "allow_local_psql_access" {
  type              = "ingress"
  from_port         = 5432
  to_port           = 5432
  protocol          = "tcp"
  security_group_id = aws_security_group.rds_sg.id
  cidr_blocks       = ["${data.sops_file.secrets.data["localIp"]}/32"]
  description       = "Allow PostgreSQL access from my local machine"
}

resource "aws_security_group" "lambda_sg" {
  name        = "lambda-security-group"
  description = "Security group for Lambda function"
  vpc_id      = data.terraform_remote_state.central.outputs.main_vpc_id
}

resource "aws_security_group_rule" "lambda_egress_rds" {
  type              = "egress"
  from_port         = 5432
  to_port           = 5432
  protocol          = "tcp"
  security_group_id = aws_security_group.lambda_sg.id
  cidr_blocks       = ["0.0.0.0/0"]
  description       = "Allow Lambda to access RDS on PostgreSQL port"
}

resource "aws_security_group_rule" "allow_lambda_to_rds" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.rds_sg.id
  source_security_group_id = aws_security_group.lambda_sg.id
  description              = "Allow access from Lambda to RDS"
}
*/
