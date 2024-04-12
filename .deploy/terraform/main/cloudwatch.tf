resource "aws_cloudwatch_log_group" "app_ecs_logs" {
  name              = "/ecs/wow-app"
  retention_in_days = 90

  tags = {
    Project = "wow app"
  }
}

# resource "aws_cloudwatch_log_group" "lb_logs" {
#   name              = "/lb/wow-app"
#   retention_in_days = 90

#   tags = {
#     Project = "wow app"
#   }
# }
