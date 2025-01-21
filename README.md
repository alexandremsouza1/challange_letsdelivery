
aws s3 cp build.zip s3://meu-bucket-sam-deploy/lambda/source.zip



aws cloudformation create-stack \
  --stack-name LetsDeliveryStack \
  --template-body file://app.yml \
  --capabilities CAPABILITY_NAMED_IAM


aws cloudformation deploy \
  --template-file app.yml \
  --stack-name letsdelivery-stack \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM



  aws cloudformation deploy \
  --template-file app.yml \
  --stack-name letsdelivery-stack \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM


aws lambda update-function-code \
  --function-name letsdelivery-stack-CustomersFunction-MOiTibc2wYAt \
  --s3-bucket meu-bucket-sam-deploy \
  --s3-key lambda/source.zip

  aws cloudformation delete-stack --stack-name letsdelivery-stack


  criar role manual

  https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-2#/roles


  https://lmx2xyimug.execute-api.us-east-2.amazonaws.com/Prod