import { test, vi ,expect} from 'vitest'
import { applyEditsToLayer } from '../Consultas2.js'

/*
  -E um conjunto de funcoes que fazem operacoes no arcgis online  
*/
describe('Consultas',()=>{
  describe('retornaListaAreaCode',()=>{
    it.todo('With IdLayer=0 should return aero_code,geometry',()=>{})
    it.todo('With IdLayer=1 should return linha_code,geometry',()=>{})
    it.todo('With IdLayer=2 should return linha_code,geometry',()=>{})
    it.todo('With IdLayer=3 should return area_code,geometry',()=>{})

  })

  describe('Operations of Fields',()=>{
    it.todo('lockFieldstable',()=>{})
    it.todo('hideFieldsTable',()=>{})
    it.todo('hideFields',()=>{})
    it.todo('findField',()=>{})
    it.todo('deleteFields',()=>{})

    })
  describe('returnEditfeatures',async()=>{
    it.todo('should return graphic in the rigth object')
  })
  describe('applyEditsToLayer', async () => {
    applyEditsToLayer
    const { applyEditsToLayer } = await import('../Consultas2.js');
    const edits = {attributes:{area_code:'PROP-ABC-1234'}}
    const url = 'https://services9.arcgis.com/6Hv9AANartyT7fJW/arcgis/rest/services/Propriedades/FeatureServer/0'
    
    it.todo('add')
    it.todo('update')
    it.todo('delete')
  })

})
