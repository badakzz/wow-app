resource "aws_lb" "app_lb" {
  name                       = "app-lb"
  internal                   = false
  load_balancer_type         = "application"
  subnets                    = [aws_subnet.lb_subnet_a.id, aws_subnet.lb_subnet_b.id]
  security_groups            = [aws_security_group.app_sg.id]
  enable_deletion_protection = false

  access_logs {
    bucket  = aws_s3_bucket.lb_logs.id
    enabled = true
  }

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "${local.name}-lb"
  }
}

resource "aws_lb_target_group" "app_tg" {
  name        = "app-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    enabled             = true
    interval            = 30
    path                = "/"
    protocol            = "HTTP"
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }
}

resource "aws_lb_listener" "app_listener" {
  load_balancer_arn = aws_lb.app_lb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_tg.arn
  }
}
