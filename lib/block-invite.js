//

export default function blockInvite (req, { blocked_ip_addresses, blocked_email_domains, blocked_email_addresses }){
  
  if (blocked_ip_addresses) {
    // convert to an array
    blocked_ip_addresses = blocked_ip_addresses.split(',')
  }

  if (blocked_email_domains) {
    // https://stackoverflow.com/questions/18371339/how-to-retrieve-name-from-email-address
    let email  = req.body.email
    let domain = email.substring(email.lastIndexOf("@") +1)

    // convert to an array and search
    if (blocked_email_domains.split(',').indexOf(domain) !== -1) {
      return true;
    }
  }

  if (blocked_email_addresses) {
    let email = req.body.email
  
    // convert to an array and search
    if (blocked_email_addresses.split(',').indexOf(email) !== -1) {
      return true;
    }
  }

  return false;

}
