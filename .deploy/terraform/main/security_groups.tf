resource "aws_security_group" "app_sg" {
  name        = "app_security_group"
  description = "Security group for application in ECS"
  vpc_id      = local.account.vpc_id

  # ingress {
  #   from_port   = 443
  #   to_port     = 443
  #   protocol    = "tcp"
  #   cidr_blocks = ["0.0.0.0/0"]
  #   description = "Allow HTTPS traffic to ECS"
  # }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "app_security_group"
  }
}

resource "aws_security_group" "ecs_sg" {
  name        = "ecs-security-group"
  description = "Security group for ECS service"
  vpc_id      = local.account.vpc_id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ECS SG"
  }
}

resource "aws_security_group" "rds_sg" {
  name        = "my-rds-sg"
  description = "Security group for RDS instance to allow HTTP/HTTPS access to S3"
  vpc_id      = local.account.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [local.org.accounts.main.security_groups.default]
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

  tags = {
    Name = "RDS Security Group"
  }
}
