#OVH
lftp -f "
open ftp.cluster051.hosting.ovh.net
user benoitx jmGqn2dRDuS6
mirror -R --only-newer --verbose --use-cache $ExcludeParams --parallel=10 --use-cache dist/ /www/pool
bye
"
