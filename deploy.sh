#!/bin/sh

set -eux

rm -rf node_modules
rm -rf dependencies/node_modules

sam build OmikujiDepLayer
sam build

OPT=""
if [ ! -e 'samconfig.toml' ] ; then
OPT="--guided"
fi
sam deploy ${OPT} \
             --parameter-overrides \
             ParameterKey=USERID,ParameterValue=${USER_ID} \
             ParameterKey=PASSWORD,ParameterValue=${PASSWORD}
