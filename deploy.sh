#!/bin/bash

# Default
CONFIG_PATH=.ftp_config
PASSIVE_MODE=on
VERIFY_CERT=true
BUILD_ENV=production

if [ $# -gt 0 ]
  then
    CONFIG_PATH=$CONFIG_PATH-$1
fi

if [ ! -f $CONFIG_PATH ]; then
    echo "Config $CONFIG_PATH not found!"
    exit
fi

# Load Config
set -a
source <(cat $CONFIG_PATH | sed -e '/^#/d;/^\s*$/d' -e "s/'/'\\\''/g" -e "s/=\(.*\)/='\1'/g")
set +a

SOURCE_FOLDER="$PWD/_site"

echo "Building website ($BUILD_ENV)..."
JEKYLL_ENV=$BUILD_ENV bundle exec jekyll build

echo "Deploying ($SOURCE_FOLDER) to ($USER@$HOST:$TARGET_FOLDER)..."

lftp -f "
set ftp:passive-mode $PASSIVE_MODE
set ssl:verify-certificate $VERIFY_CERT
open $HOST
user $USER $PASS
lcd $SOURCE_FOLDER
mirror --verbose --reverse --ignore-time --delete $SOURCE_FOLDER $TARGET_FOLDER
"