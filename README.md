# 1. backend

- lambda에 업로드할 spring project

### java download

- AWS Corretto: https://docs.aws.amazon.com/corretto/latest/corretto-17-ug/downloads-list.html

### spring 프로젝트 생성

- Spring Boot 프로젝트 생성: https://start.spring.io/#!type=maven-project&language=java&platformVersion=3.2.2&packaging=jar&jvmVersion=17&groupId=com.fmarket&artifactId=backend&name=backend&description=fastcampus%20fmarket%20project&packageName=com.fmarket.backend&dependencies=lombok,web
- ChatGPT: https://chat.openai.com/
- Spring Boot를 Lambda에 배포: https://github.com/aws/serverless-java-container/wiki/Quick-start---Spring-Boot3
- 프로젝트 빌드
  - maven 의존성 추가: https://docs.aws.amazon.com/ko_kr/lambda/latest/dg/java-package.html#java-package-libraries
  - 빌드: https://docs.aws.amazon.com/ko_kr/lambda/latest/dg/java-package.html#java-package-maven

# 2. frontend & nodejs_lambda

- frontend: cloudfront에 업로드할 react(vite) project
- nodejs_lambda: lambda에 업로드할 javascript handler

### nodejs download

- nodejs 18 LTS: https://nodejs.org/en/download

### vite docs

- vite: https://ko.vitejs.dev/guide/

# 3. python_lambda

- lambda에 업로드할 python handler

### python download

- python 3.11: https://www.python.org/downloads/

# 4. terraform

- aws resource 생성을 위한 terraform project

### docs

- aws provider: https://registry.terraform.io/providers/hashicorp/aws/5.29.0/docs
- aws module: https://registry.terraform.io/namespaces/terraform-aws-modules
