# Delete each directory in cypress/fixtures/
for f in cypress/fixtures/*
do
  if [ -d ${f} ]
  then
    rm -rf ${f}
  fi
done
# Make each json file in cypress/fixtures/ into an empty object
for jdir in cypress/fixtures/*.json
do
  echo '{}' > ${jdir}
done
rm -rf cypress/fixtures_new
# ...and replace it with fresh data
npm run cypress:run
# Now replace the old fixtures
rm -rf cypress/fixtures
mv cypress/fixtures_new cypress/fixtures
