resource "aws_vpc" "main" {
  cidr_block           = "172.31.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "MainVPC"
  }
}

resource "aws_subnet" "ecs_subnet" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "172.31.0.0/20"
  availability_zone       = "eu-west-3a"
  map_public_ip_on_launch = true
  tags = {
    Name = "ECS Subnet"
  }
}

resource "aws_subnet" "rds_subnet_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "172.31.16.0/20"
  availability_zone = "eu-west-3a"
  tags = {
    Name = "RDS Subnet"
  }
}

resource "aws_subnet" "lb_subnet_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "172.31.32.0/20"
  availability_zone       = "eu-west-3a"
  map_public_ip_on_launch = true

  tags = {
    Name = "Load Balancer Subnet"
  }
}

resource "aws_subnet" "rds_subnet_b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "172.31.64.0/20"
  availability_zone = "eu-west-3b"
  tags = {
    Name = "RDS Subnet B"
  }
}

resource "aws_subnet" "lb_subnet_b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "172.31.80.0/20"
  availability_zone       = "eu-west-3b"
  map_public_ip_on_launch = true
  tags = {
    Name = "Load Balancer Subnet B"
  }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "Main Internet Gateway"
  }
}

resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
  tags = {
    Name = "Public Route Table"
  }
}

resource "aws_route_table_association" "ecs_route" {
  subnet_id      = aws_subnet.ecs_subnet.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "rds_route_a" {
  subnet_id      = aws_subnet.rds_subnet_a.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "lb_route_a" {
  subnet_id      = aws_subnet.lb_subnet_a.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "lb_route_b" {
  subnet_id      = aws_subnet.lb_subnet_b.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "rds_route_b" {
  subnet_id      = aws_subnet.rds_subnet_b.id
  route_table_id = aws_route_table.public_route_table.id
}
