resource "aws_iam_role" "lambda_execution_role" {
  name = "lambda_execution_role_for_logs"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Effect = "Allow",
        Sid    = ""
      },
    ]
  })
}

resource "aws_iam_role_policy" "lambda_policy" {
  role = aws_iam_role.lambda_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "s3:GetObject",
          "rds-db:connect",
          "ec2:CreateNetworkInterface",
          "ec2:DeleteNetworkInterface",
          "ec2:DescribeNetworkInterfaces"
        ],
        Resource = "*"
      }
    ]
  })
}

resource "aws_lambda_function" "log_processor" {
  filename         = "../../../lambda_functions/sendToCloudWatch/sendToCloudWatch.zip"
  function_name    = "log_processor"
  role             = aws_iam_role.lambda_execution_role.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  source_code_hash = filebase64sha256("../../../lambda_functions/sendToCloudWatch/sendToCloudWatch.zip")
  timeout          = 30

  environment {
    variables = {
      LOG_GROUP_NAME = "${aws_cloudwatch_log_group.lb_logs.name}"
      REGION         = "${local.account.region}"
    }
  }
}

resource "aws_lambda_function" "delete_old_records" {
  filename         = "../../../lambda_functions/cronDeleteOldPricesRecords/cronDeleteOldPricesRecords.zip"
  function_name    = "delete_old_records"
  role             = aws_iam_role.lambda_execution_role.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  source_code_hash = filebase64sha256("../../../lambda_functions/cronDeleteOldPricesRecords/cronDeleteOldPricesRecords.zip")
  timeout          = 30

  vpc_config {
    subnet_ids         = [data.terraform_remote_state.central.outputs.rds_subnet_a_id, data.terraform_remote_state.central.outputs.rds_subnet_b_id]
    security_group_ids = [aws_security_group.lambda_sg.id]
  }

  environment {
    variables = {
      DB_USER     = "${data.sops_file.secrets.data["databaseUser"]}",
      DB_PASSWORD = "${data.sops_file.secrets.data["databasePassword"]}",
      DB_NAME     = "${data.sops_file.secrets.data["databaseName"]}",
      DB_HOST     = "${data.sops_file.secrets.data["databaseHost"]}",
      DB_PORT     = "${data.sops_file.secrets.data["databasePort"]}"
    }
  }
}
