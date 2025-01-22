# Projeto LetsDelivery Lambda

Este projeto implementa uma função Lambda usando Node.js 20 na AWS, com DynamoDB como banco de dados. Ele foi projetado para gerenciar operações relacionadas aos clientes do serviço LetsDelivery.

## Índice

- [Pré-requisitos](#pré-requisitos)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Build](#instruções-de-build)
- [Passos para Implantação](#passos-para-implantação)
- [Ponto de Entrada da API](#ponto-de-entrada-da-api)
- [Desenvolvimento Local](#desenvolvimento-local)
- [Testes](#instruções-de-testes)
- [Função IAM](#função-iam)
- [Limpeza](#limpeza)
- [Resolução de Problemas](#resolução-de-problemas)
- [Licença](#licença)

## Pré-requisitos

Antes de começar, certifique-se de ter os seguintes itens instalados e configurados:

- AWS CLI
- Node.js 20
- Docker (para testes locais com o DynamoDB)
- Uma conta na AWS com permissões adequadas

Para que funcione corretamente é necessario criar o bucket s3 de forma manual. Eu o chamei de meu-bucket-sam-deploy. 
No momento isso é importante pois essa configuração está sendo usada pelo cloudformation template.

## Estrutura do Projeto
```bash
└── alexandremsouza1-challange_letsdelivery/
    ├── README.md
    ├── api.http
    ├── app.yml
    ├── jest-dynamodb-config.js
    ├── jest.config.js
    ├── jest.setup.js
    ├── package.json
    ├── tsconfig.json
    ├── src/
    │   ├── customer.ts
    │   ├── customerService.ts
    │   └── index.ts
    └── /
        ├── customer.test.ts
        └── customerService.test.ts
```

## Instruções de Build

### Build

Para compilar o código TypeScript para JavaScript, execute o seguinte comando no terminal:

```bash
npm run build
```

Isso irá:
1. Limpar a pasta `build` (usando `rimraf`).
2. Compilar o código TypeScript para a pasta `build` (usando o `tsc`, o compilador TypeScript).

**IMPORTANTE** Após o build, você pode empacotar o conteúdo da pasta `build` e `node_modules` para enviar ao S3 


## Passos para Implantação

Aqui voce deve rodar o build da aplicação e zipar o conteudo da pasta build junto com o node_modules. 
De o nome desse arquivo compactado de `build.zip`

1. Empacote a função Lambda:

```bash
aws s3 cp build.zip s3://meu-bucket-sam-deploy/lambda/source.zip
```

1.2 Implemente o stack do CloudFormation:
```bash
aws cloudformation deploy --template-file app.yml --stack-name letsdelivery-stack --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM
```

1.3 Atualize o código da função Lambda (se necessário):
```bash
aws lambda update-function-code --function-name letsdelivery-stack-CustomersFunction-MOiTibc2wYAt --s3-bucket meu-bucket-sam-deploy --s3-key lambda/source.zip
```


## Ponto de Entrada da API
A API pode ser acessada em:

https://neokrwg676.execute-api.us-east-2.amazonaws.com/Prod


## Desenvolvimento Local
Configuração do DynamoDB Local
1. Inicie o DynamoDB local:
```bash
docker run -d -p 8000:8000 amazon/dynamodb-local
```

2. Teste a conexão:
```bash
aws dynamodb list-tables --endpoint-url http://localhost:8000
```


3. Crie uma tabela local para os clientes:
```bash
aws dynamodb create-table --table-name Customers --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --endpoint-url http://localhost:8000
```

## Instruções de Build

### Testes

Para rodar os testes, você pode usar o comando:

```bash
npm run test
```

Isso irá executar o `jest` para rodar os testes localmente, conforme configurado no seu projeto.

Certifique-se de que o DynamoDB esteja rodando localmente antes de executar os testes, pois a função Lambda dependerá disso. Se necessário, ajuste a configuração do Jest para usar o DynamoDB local durante os testes.

### Cobertura de testes
![image](https://github.com/user-attachments/assets/c815b5b1-594b-4913-aba8-ebcaacbda745)


## Função IAM

Crie uma função IAM manual para a função Lambda:

[Console IAM da AWS](https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-2#/roles)

Certifique-se de que a função tenha as permissões necessárias para acessar o DynamoDB e quaisquer outros serviços da AWS que sua função Lambda possa precisar.

## Limpeza

Para excluir o stack do CloudFormation:

```bash
aws cloudformation delete-stack --stack-name letsdelivery-stack
```


## Resolução de Problemas

- Se encontrar problemas de permissão, verifique se sua AWS CLI está configurada com as credenciais corretas e se o usuário ou função IAM tem as permissões necessárias.
- Para falhas de implantação, verifique a console do CloudFormation para mensagens de erro detalhadas.
- Se a função Lambda não estiver se comportando conforme esperado, consulte os logs do CloudWatch para a função.


## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para mais detalhes.
