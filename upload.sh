#!/bin/sh

HOST=5.63.153.69
tar -zcf site.tar.gz dist
scp site.tar.gz root@$HOST:~/
rm -rf site.tar.gz
