resource "aws_route53_record" "wow_app_alias" {
  zone_id = data.terraform_remote_state.central.outputs.main_zone_id
  name    = "wowapp.${data.sops_file.secrets.data["domainName"]}"
  type    = "A"
  alias {
    name                   = data.terraform_remote_state.central.outputs.app_lb_dns_name
    zone_id                = data.terraform_remote_state.central.outputs.app_lb_zone_id
    evaluate_target_health = true
  }
}
