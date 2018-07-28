//

export default function blockInvite (req, { blocked_ip_addresses, blocked_email_domains, blocked_email_addresses }){
  
  if (blockInviteByIp(req, blocked_ip_addresses)) {
    return true;
  }

  if (blocked_email_domains) {
    let email  = req.body.email;
    // https://stackoverflow.com/questions/18371339/how-to-retrieve-name-from-email-address
    let domain = email.substring(email.lastIndexOf("@") +1);
    // convert to an array and search
    if (blocked_email_domains.split(',').indexOf(domain) !== -1) {
      return true;
    }
  }

  if (blocked_email_addresses) {
    let email = req.body.email;
    // convert to an array and search
    if (blocked_email_addresses.split(',').indexOf(email) !== -1) {
      return true;
    }
  }

  return false;

}

function blockInviteByIp (req, blocked_ip_addresses)
{
  // convert to an array and search
  return blocked_ip_addresses && blockInviteByIp1(req, blocked_ip_addresses.split(','));
}

function blockInviteByIp1 (req, blocked_ip_array)
{
  // Block is any of the below IP addresses are found in the array.
  let block =
    blockInviteByIp2(req.connection.remoteAddress, blocked_ip_array) ||
    (req.socket            && blockInviteByIp2(req.socket.remoteAddresss,           blocked_ip_array)) ||
    (req.connection.socket && blockInviteByIp2(req.connection.socket.remoteAddress, blocked_ip_array));

  let xForwardedForArray = (req.headers['x-forwarded-for'] || '').split(',');

  xForwardedForArray.forEach(function(ip) {
    block = block || blockInviteByIp2(ip, blocked_ip_array)
  });

  return block;
}
function blockInviteByIp2 (ip, blocked_ip_array)
{
  return ip && (blocked_ip_array.indexOf(ip) !== -1);
}
