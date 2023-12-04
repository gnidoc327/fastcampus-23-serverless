rm -rf ./package venv goods_recommand.zip

mkdir package
pip3 install -r requirements.txt --target ./package

cd package
zip -r ../goods_recommand.zip .

cd ..
zip goods_recommand.zip goods_recommand.py

aws lambda update-function-configuration --function-name goods-recommand --handler goods_recommand.lambda_handler --timeout 30 --description aws:states:opt-out
aws lambda update-function-code --function-name goods-recommand --zip-file fileb://goods_recommand.zip --no-paginate --no-cli-pager
rm -rf ./package venv goods_recommand.zip
