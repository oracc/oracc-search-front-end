# Delete any existing gathered stub data...
rm -rf cypress/fixtures_new
# ...and replace it with fresh data
npm run cypress:run
# Now copy new fixtures
mv cypress/fixtures_new cypress/fixtures
