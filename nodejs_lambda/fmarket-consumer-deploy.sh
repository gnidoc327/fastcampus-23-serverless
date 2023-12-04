npm install
zip -r fmarketConsumer.zip .
aws lambda update-function-configuration --function-name fmarket-consumer --handler fmarketConsumer.handler --timeout 30 --description aws:states:opt-out
aws lambda update-function-code --function-name fmarket-consumer --zip-file fileb://fmarketConsumer.zip --no-paginate --no-cli-pager
rm fmarketConsumer.zip
