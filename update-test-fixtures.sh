# Delete any existing gathered stub data...
rm -rf cypress/fixtures_new
# ...and replace it with fresh data
npm run cypress:run
# Now copy new fixtures (mv doesn't work for merging!)
cp -rt cypress/fixtures cypress/fixtures_new/*
rm -rf cypress/fixtures_new
