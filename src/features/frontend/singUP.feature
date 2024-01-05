Feature :"Fluxos de Logins na aplicacao"

    Cenário:Criacao de usuario
    Quando um usuario clicar em criar novo usuario com o email pecenergia enviar seu email no campo da pagina
    Entao ele sera criado no banco de dados e esperara aprovacao do administrador
    Quando o usuario for aprovado pelo administrador 
    Entao recebera um email de redirecionamento ,ao ser redirecionado ira criar o usuario 
    com nome e senha e o profile sera pre-definido pelo administrador.

    Cenário:Esqueceu a senha 
    Quando o usuario clicar em esqureceu a senha , ele ira inserir seu email
    Entao ele recebera um email de redirecionamento onde ira inserir sua nova senha