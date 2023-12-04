npm install
zip -r fmarketImageResize.zip .
aws lambda update-function-configuration --function-name fmarket-image-resize --handler fmarketImageResize.handler --timeout 60 --description aws:states:opt-out
aws lambda update-function-code --function-name fmarket-image-resize --zip-file fileb://fmarketImageResize.zip --no-paginate --no-cli-pager
rm fmarketImageResize.zip
