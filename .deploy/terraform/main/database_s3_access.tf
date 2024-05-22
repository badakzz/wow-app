resource "aws_iam_policy" "s3-access" {
  name        = "s3-access"
  description = "A policy for S3 access."
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "s3import"
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:ListBucket",
        ]
        Resource = [
          "arn:aws:s3:::wow-app-db",
          "arn:aws:s3:::wow-app-db/*",
        ]
      },
    ]
  })
}

resource "aws_iam_role" "rds-assume-role" {
  name = "rds"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "rds.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "rds-to-s3" {
  role       = aws_iam_role.rds-assume-role.name
  policy_arn = aws_iam_policy.s3-access.arn
}

resource "aws_db_instance_role_association" "rds_s3import_role" {
  db_instance_identifier = module.db.db_instance_identifier
  feature_name           = "s3Import"
  role_arn               = aws_iam_role.rds-assume-role.arn
}
