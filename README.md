# Front-End NGCASH - ADMISSION TEST

Essa é uma implementação de uma aplicação Front-End teste para admissão na empresa NG.CASH

## Para rodar a aplicação usando o docker:
crie o arquivo .env.local e coloque:

    NEXT_PUBLIC_URL=http://localhost:3001/

Em seguida, rode os seguintes comandos, com o Back-End da aplicação já iniciado:

    $ docker build -t nextjs-ngcash ./

    $ docker run -p 3000:3000 nextjs-ngcash


