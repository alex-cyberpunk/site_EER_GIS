import React from 'react';
import "@esri/calcite-components/dist/components/calcite-input-date-picker";
import "@esri/calcite-components/dist/components/calcite-label";

function Calendar() {
  return (
    <div>
            <calcite-label>
                Selecione um periodo de Consulta
                <calcite-input-date-picker range icon="depart">
                </calcite-input-date-picker>
            </calcite-label>
    </div>
  );
}


export default Calendar;
