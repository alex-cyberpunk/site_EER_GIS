<template>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
    <title>Update Feature Attributes | Sample | ArcGIS Maps SDK for JavaScript 4.27</title>
</head>
<body>
    <!-- script de js -->

    <div id="info" class="esri-widget">
        <h3>Select a feature to begin </h3>
    </div>

    <div id="update" class="esri-widget">
      <div id="form" class="scroller esri-component">
      </div>
      <label for="fileInput" class="custom-file-upload">
        <calcite-icon icon="upload" scale="m"  title="(.kmz , .kml ou .zip com shapefiles)"></calcite-icon> Propriedade
      </label>
      <input type="file" id="fileInput" accept=".kmz, .kml, .zip" />
      <p>
        <input type="button" class="esri-button" value="Enviar solicitacao" id="btnUpdate" />
      </p>
        
    </div>

    <div id="justify" class="esri-widget" style="display: none;">
      <div id="form" class="scroller esri-component">
      </div>
      <p>
        <input type="button" class="esri-button" value="Enviar justificativa" id="btnSend" />
      </p>
        
    </div>

</body>
</template>

    <script type="module" src="../../../Sing-in/users.js"></script>



