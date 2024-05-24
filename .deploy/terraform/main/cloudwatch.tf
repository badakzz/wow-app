resource "aws_cloudwatch_log_group" "app_ecs_logs" {
  name              = "/ecs/wow-app"
  retention_in_days = 30

  tags = {
    Project = "wow app"
  }
}
