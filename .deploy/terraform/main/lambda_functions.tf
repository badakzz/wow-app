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
  role   = aws_iam_role.lambda_execution_role.id
  policy = data.aws_iam_policy_document.lambda_policy_doc.json
}

data "aws_iam_policy_document" "lambda_policy_doc" {
  statement {
    actions   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["arn:aws:logs:*:*:*"]
  }

  statement {
    actions   = ["s3:GetObject"]
    resources = [data.terraform_remote_state.central.outputs.lb_logs_bucket_arn]
  }
}

resource "aws_lambda_function" "log_processor" {
  filename         = "../../../lambda_functions/sendToCloudWatch.zip"
  function_name    = "log_processor"
  role             = aws_iam_role.lambda_execution_role.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  source_code_hash = filebase64sha256("../../../lambda_functions/sendToCloudWatch.zip")

  environment {
    variables = {
      LOG_GROUP_NAME = "${aws_cloudwatch_log_group.lb_logs.name}"
      REGION         = "${local.account.region}"
    }
  }
}

