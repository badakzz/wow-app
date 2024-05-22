variable "tags" {
  type        = map(string)
  description = "tags to add created resources"
  default     = {}
}

variable "name_prefix" {
  type        = string
  description = "prefix for bucket name"
}
