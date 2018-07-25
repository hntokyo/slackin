//

export default function blockInvite (email, { blocked_ip_addresses, blocked_email_domains, blocked_email_addresses }){

  if (blocked_ip_addresses) {
    // convert to an array
    blocked_ip_addresses = blocked_ip_addresses.split(',')
  }

  if (blocked_email_domains) {
    // convert to an array
    blocked_email_domains = blocked_email_domains.split(',')
  }

  if (blocked_email_addresses) {
    // convert to an array and search for email
    if (blocked_email_addresses.split(',').indexOf(email) === -1) {
      return true;
    }
  }

  return false;

}
