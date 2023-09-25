<template>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">

  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="viewDiv"></div>
    <!-- 02 - appcontainer -->
    <div id="appContainer">
      <div id="tableContainer" class="container">
        <div id="tableDiv"></div>
      </div>
      

      <div id="mainDiv" class="esri-widget" style="display: none;" title="Mostra/esconde tabela">
        <label class="switch">
          <input id="checkboxId" type="checkbox" checked="yes" />
          <span class="slider round"></span>
        </label>
        <label class="labelText" id="labelText">Hide feature table</label>
      </div>
    </div>


  </body>
</template>

<!--<script type="module" src="../data/mapaPedidos/index.js"></script>-->
<script>
export default {
    name: 'appView',
    async mounted() {
        const app = await import('../data/mapaPedidos/index.js');
        app.initialize(this.$el);
    }
};
</script>