resource "aws_lambda_permission" "allow_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.log_processor.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = data.terraform_remote_state.central.outputs.lb_logs_bucket_arn
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = data.terraform_remote_state.central.outputs.lb_logs_bucket_id

  lambda_function {
    lambda_function_arn = aws_lambda_function.log_processor.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "wow-app/"
  }

  depends_on = [aws_lambda_permission.allow_bucket]
}
