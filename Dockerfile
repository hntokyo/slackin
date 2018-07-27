FROM node:slim

ENV PORT 3000

ADD . /srv/www

WORKDIR /srv/www

RUN npm install --unsafe-perm

EXPOSE 3000

CMD ./bin/slackin --coc "$SLACK_COC" --channels "$SLACK_CHANNELS" --port $PORT --blocked_ip_addresses "$BLOCKED_IP_ADDRESSES" --blocked_email_domains "$BLOCKED_EMAIL_DOMAINS" --blocked_email_addresses "$BLOCKED_EMAIL_ADDRESSES" $SLACK_SUBDOMAIN $SLACK_API_TOKEN $GOOGLE_CAPTCHA_SECRET $GOOGLE_CAPTCHA_SITEKEY
