#
# Nginx plus image. Built based on instructions from
# https://www.nginx.com/blog/deploying-nginx-nginx-plus-docker/
#

FROM centos:7

USER root

ARG BUILD_TAG
LABEL maintainer="NGINX Docker Maintainers <docker-maint@nginx.com>"
LABEL build.tag=${BUILD_TAG}

# Download certificate and key from the customer portal (https://cs.nginx.com)
# and copy to the build context
COPY nginx-repo.crt /etc/ssl/nginx/
COPY nginx-repo.key /etc/ssl/nginx/

# Install NGINX Plus
RUN yum install -y wget\
  && yum install -y net-tools\
  && wget -P /etc/yum.repos.d https://cs.nginx.com/static/files/nginx-plus-7.4.repo \
  && yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm  \
  && echo "== Install nginx first ==" \
  && yum install -y \
    nginx-plus-15-2.el7_4.ngx \
  && echo " == nginx installed, install plugins ==" \
  && yum install -y \
    nginx-plus-module-modsecurity-15+1.0.0-4.el7_4.ngx \
    nginx-plus-module-njs-15+0.2.0-2.el7_4.ngx \
    nginx-plus-module-headers-more-15+0.33-2.el7_4.ngx \
    nginx-plus-module-lua-15+0.10.13-2.el7_4.ngx

   #nginx-plus-module-geoip2
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
  && ln -sf /dev/stderr /var/log/nginx/error.log \
  && echo "========= Nginx version ============" \
  && nginx -V

# Install modsecurity CRS and enable modsecurity
ENV CRS_VERSION 3.0.2
RUN set -x \
  && wget https://github.com/SpiderLabs/owasp-modsecurity-crs/archive/v$CRS_VERSION.tar.gz -O /tmp/v$CRS_VERSION.tar.gz \
  && tar zxf /tmp/v$CRS_VERSION.tar.gz -C /usr/local/ \
  && rm /tmp/v$CRS_VERSION.tar.gz \
  && mv /usr/local/owasp-modsecurity-crs-$CRS_VERSION/crs-setup.conf.example /usr/local/owasp-modsecurity-crs-$CRS_VERSION/crs-setup.conf \
  && mkdir /etc/nginx/modsec \
  && wget https://raw.githubusercontent.com/SpiderLabs/ModSecurity/v3/master/modsecurity.conf-recommended -O /etc/nginx/modsec/modsecurity.conf \
  && sed -i 's/SecRuleEngine DetectionOnly/SecRuleEngine On/g' /etc/nginx/modsec/modsecurity.conf \
  && sed -i 's/!^%{tx.allowed_request_content_type}\$/!@within %{tx.allowed_request_content_type}/g' /usr/local/owasp-modsecurity-crs-3.0.2/rules/REQUEST-920-PROTOCOL-ENFORCEMENT.conf \
  && echo "# Include the recommended configuration" >> /etc/nginx/modsec/main.conf \
  && echo "Include /etc/nginx/modsec/modsecurity.conf" >> /etc/nginx/modsec/main.conf \
  && echo "# OWASP CRS v3 rules" >> /etc/nginx/modsec/main.conf \
  && echo "Include /usr/local/owasp-modsecurity-crs-$CRS_VERSION/crs-setup.conf" >> /etc/nginx/modsec/main.conf \
  && echo "Include /usr/local/owasp-modsecurity-crs-$CRS_VERSION/rules/*.conf" >> /etc/nginx/modsec/main.conf \
  && echo "SecAction \\" >> /usr/local/owasp-modsecurity-crs-$CRS_VERSION/crs-setup.conf \
  && echo "  \"id:900000,\\" >> /usr/local/owasp-modsecurity-crs-$CRS_VERSION/crs-setup.conf \
  && echo "   phase:1,\\" >> /usr/local/owasp-modsecurity-crs-$CRS_VERSION/crs-setup.conf \
  && echo "   nolog,\\" >> /usr/local/owasp-modsecurity-crs-$CRS_VERSION/crs-setup.conf \
  && echo "   pass,\\" >> /usr/local/owasp-modsecurity-crs-$CRS_VERSION/crs-setup.conf \
  && echo "   t:none,\\" >> /usr/local/owasp-modsecurity-crs-$CRS_VERSION/crs-setup.conf \
  && echo "   setvar:tx.paranoia_level=2\"" >> /usr/local/owasp-modsecurity-crs-$CRS_VERSION/crs-setup.conf

EXPOSE 80
STOPSIGNAL SIGTERM
CMD ["nginx", "-g", "daemon off;"]