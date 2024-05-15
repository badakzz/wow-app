resource "aws_lb_listener_rule" "wow_app_listener_rule" {
  listener_arn = data.terraform_remote_state.central.outputs.app_listener_arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = data.terraform_remote_state.central.outputs.app_tg_arn
  }

  condition {
    host_header {
      values = ["wow-app.${data.sops_file.secrets.data["domainName"]}"]
    }
  }
}
