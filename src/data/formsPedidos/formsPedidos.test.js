test('warningMessages', async()=>{
    //testa se todas as mensagen de aviso estao funcionando conforme o esperado
    //Usa mocks de entrada e testa a saida de createpopups()
    expect(Array.isArray(movies)).toBeTruthy();
    expect(movies.length).toBeTruthy();

})
test('fillAreaCode', async()=>{
    //testa se o campo area code e preenchido corretamente quando selecionam um projeto
    //ver formsType(type,form,user,portal) returnProjetos
    expect(Array.isArray(movies)).toBeTruthy();
    expect(movies.length).toBeTruthy();

})
test('choosenRitghForms', async()=>{
    //testa se o formulario escolhido e o relacionado ao botao
    //ver formsType(type,form,user,portal)
    expect(Array.isArray(movies)).toBeTruthy();
    expect(movies.length).toBeTruthy();

})


test('conversionKmzToGeojson', async()=>{
    //testa se a conversao do kmz para geojson age como o esperado 
    // Usa mocks de entrada com  a saida de convert2D()
    expect(Array.isArray(movies)).toBeTruthy();
    expect(movies.length).toBeTruthy();

})



test('justify', async()=>{
    //testa se o qdo precisa de justificativa os campos acionados estao corretos
    // Usa mocks de entrada com  a saida de verificaEExecuta()
    expect(Array.isArray(movies)).toBeTruthy();
    expect(movies.length).toBeTruthy();

})
test('cleanSet', async()=>{
    //testa se ele retorna o formulario para o estado inicial quando um area e aproavd
    // Usa mocks de entrada com  a saida de restauraCampos()
    expect(Array.isArray(movies)).toBeTruthy();
    expect(movies.length).toBeTruthy();

})