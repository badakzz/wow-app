resource "aws_ecs_cluster" "app_cluster" {
  name = "wow-app-cluster"
}

resource "aws_ecs_task_definition" "app_task" {
  family                   = "wow-app-task"
  cpu                      = "256"
  memory                   = "512"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = "arn:aws:iam::${local.account.id}:role/ECSTaskExecutionRole"

  container_definitions = jsonencode([
    {
      name      = "wow-app"
      image     = "${local.account.id}.dkr.ecr.${local.account.region}.amazonaws.com/wow-app:latest"
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ]
      environment = [
        { name = "TSM_CLIENT_ID", value = "${data.sops_file.secrets.data["tsmClientId"]}" },
        { name = "TSM_API_KEY", value = "${data.sops_file.secrets.data["tsmApiKey"]}" },
        { name = "WOW_CLIENT_ID", value = "${data.sops_file.secrets.data["wowClientId"]}" },
        { name = "WOW_SECRET_KEY", value = "${data.sops_file.secrets.data["wowSecretKey"]}" },
        { name = "DATABASE_URL", value = "${data.sops_file.secrets.data["databaseUrl"]}" },
        { name = "DATABASE_PASSWORD", value = "${data.sops_file.secrets.data["databasePassword"]}" },
        { name = "WARCRAFT_LOGS_CLIENT_ID", value = "${data.sops_file.secrets.data["warcraftLogsClientId"]}" },
        { name = "WARCRAFT_LOGS_CLIENT_SECRET", value = "${data.sops_file.secrets.data["warcraftLogsClientSecret"]}" },
        { name = "PROJECT_ROOT", value = "${data.sops_file.secrets.data["projectRoot"]}" }

      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "${aws_cloudwatch_log_group.app_ecs_logs.name}"
          awslogs-region        = "${local.account.region}"
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "app_service" {
  name            = "wow-app-service"
  cluster         = aws_ecs_cluster.app_cluster.id
  task_definition = aws_ecs_task_definition.app_task.arn
  launch_type     = "FARGATE"

  desired_count = 1

  network_configuration {
    subnets          = [data.terraform_remote_state.central.outputs.ecs_subnet_id]
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }
  load_balancer {
    target_group_arn = data.terraform_remote_state.central.outputs.app_tg_arn
    container_name   = "wow-app"
    container_port   = 3000
  }
}

resource "aws_appautoscaling_target" "ecs_target" {
  service_namespace  = "ecs"
  resource_id        = "service/${aws_ecs_cluster.app_cluster.name}/${aws_ecs_service.app_service.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  min_capacity       = 1
  max_capacity       = 10
}

resource "aws_appautoscaling_policy" "cpu_based" {
  name               = "cpu-based-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_target.service_namespace

  target_tracking_scaling_policy_configuration {
    target_value = 70.0
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
  }
}
