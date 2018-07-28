//

export default function blockInvite (req, { blocked_ip_addresses, blocked_email_domains, blocked_email_addresses })
{
  return req && (
    blockInviteByIp(   req, blocked_ip_addresses) ||
    blockInviteByEmail(req, { blocked_email_domains, blocked_email_addresses }));
}

function blockInviteByEmail (req, { blocked_email_domains, blocked_email_addresses })
{
  return req.body       &&
         req.body.email &&
         blockInviteByEmail1( req.body.email, { blocked_email_domains, blocked_email_addresses });       
}

function blockInviteByEmail1 (email, { blocked_email_domains, blocked_email_addresses })
{
  return (blocked_email_domains   && blockInviteByEmailDomain( email, blocked_email_domains  )) ||
         (blocked_email_addresses && blockInviteByEmailAddress(email, blocked_email_addresses));
}

function blockInviteByEmailDomain (email, blocked_email_domains)
{
  // https://stackoverflow.com/questions/18371339/how-to-retrieve-name-from-email-address
  let domain = email.substring(email.lastIndexOf("@") +1);
  // convert to an array and search
  return (blocked_email_domains.split(',').indexOf(domain) !== -1);
}

function blockInviteByEmailAddress (email, blocked_email_addresses)
{
  // convert to an array and search
  return (blocked_email_addresses.split(',').indexOf(email) !== -1);
}

function blockInviteByIp (req, blocked_ip_addresses)
{
  // convert to an array and search
  return blocked_ip_addresses && blockInviteByIp1(req, blocked_ip_addresses.split(','));
}

function blockInviteByIp1 (req, blocked_ip_array)
{
  // Block if any of the below IP addresses are found in the array.
  return
    (req.connection && blockInviteByIpConnection(        req.connection,            blocked_ip_array)) ||
    (req.socket     && blockInviteByIp2(                 req.socket.remoteAddresss, blocked_ip_array)) ||
    (req.headers    && blockInviteByIpXForwardedForArray(req.headers,               blocked_ip_array));
}

function blockInviteByIpConnection (connection, blocked_ip_array)
{
  return blockInviteByIp2(connection.remoteAddress, blocked_ip_array) ||
    (connection.socket && blockInviteByIp2(connection.socket.remoteAddress, blocked_ip_array));
}

function blockInviteByIpXForwardedForArray (headers, blocked_ip_array)
{
  let block              = false;
  let xForwardedForArray = (headers['x-forwarded-for'] || '').split(',');

  xForwardedForArray.forEach(function(ip) {
    block = block || blockInviteByIp2(ip, blocked_ip_array)
  });

  return block;
}

function blockInviteByIp2 (ip, blocked_ip_array)
{
  return ip && (blocked_ip_array.indexOf(ip) !== -1);
}
