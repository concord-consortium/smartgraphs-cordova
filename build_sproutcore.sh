#!/bin/bash
[ -s "$HOME/.rvm/scripts/rvm" ] && . "$HOME/.rvm/scripts/rvm"

rvm ruby-1.9.3

rm -rf ./smartgraphs/apps/smartgraphs/activity_json/*.js
rm -rf ./www/images
./download_activities.py
cd smartgraphs
rm -rf ./tmp
bundle install
bundle exec sc-build smartgraphs -r --languages=en
cd ..
rm -rf ./www/static
cp -r smartgraphs/tmp/build/static www
SG_BUILD=`ls ./www/static/smartgraphs/en`
echo "using build $SG_BUILD"
python -c "import sgutils; sgutils.copyHtmlTemplate('$SG_BUILD')"
python -c 'import sgutils; sgutils.makeRelativeUrls()'
