#!/bin/bash
set -a
source <(cat .ftp_config | sed -e '/^#/d;/^\s*$/d' -e "s/'/'\\\''/g" -e "s/=\(.*\)/='\1'/g")
set +a

SOURCE_FOLDER="$PWD/_site"

echo "Deploying ($SOURCE_FOLDER) to ($TARGET_FOLDER)..."

# exit

lftp -f "
set ftp:passive-mode off
open $HOST
user $USER $PASS
lcd $SOURCE_FOLDER
mirror --verbose --reverse --ignore-time $SOURCE_FOLDER $TARGET_FOLDER
"