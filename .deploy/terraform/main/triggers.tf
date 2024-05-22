resource "aws_s3_bucket_notification" "aws-lambda-trigger-alb-cloudfront" {
  depends_on = [aws_lambda_permission.allow_bucket_forward_logs]
  bucket     = "wow-app-loadbalancer-logs"
  lambda_function {
    lambda_function_arn = aws_lambda_function.forward_logs_s3_cloudwatch.arn
    events              = ["s3:ObjectCreated:*"]
  }
}

resource "aws_cloudwatch_event_rule" "weekly_trigger" {
  name                = "weekly-delete-prices-history"
  schedule_expression = "cron(0 12 ? * SUN *)"
}

resource "aws_cloudwatch_event_target" "invoke_lambda" {
  rule      = aws_cloudwatch_event_rule.weekly_trigger.name
  target_id = "TargetFunctionV1"
  arn       = aws_lambda_function.delete_old_records.arn
}

resource "aws_lambda_permission" "allow_cloudwatch" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.delete_old_records.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.weekly_trigger.arn
}
