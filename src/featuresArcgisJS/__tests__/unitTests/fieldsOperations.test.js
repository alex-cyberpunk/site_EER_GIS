const FieldOperations = require('./FieldOperations'); // Ajuste o caminho conforme necessário

describe('FieldOperations', () => {
    let feat;
    let fieldOps;

    beforeEach(() => {
        feat = {
            layer: {
                fields: [
                    { name: 'field1', editable: true, visible: true },
                    { name: 'field2', editable: true, visible: true },
                    { name: 'field3', editable: true, visible: true },
                ]
            },
            fields: [
                { name: 'field1' },
                { name: 'field2' },
                { name: 'field3' },
            ]
        };
        fieldOps = new FieldOperations(feat);
    });

    test('lockFieldsTable', () => {
        fieldOps.lockFieldsTable(['field1', 'field3'], false);
        expect(feat.layer.fields[0].editable).toBe(false);
        expect(feat.layer.fields[1].editable).toBe(true);
        expect(feat.layer.fields[2].editable).toBe(false);
    });

    test('hideFieldsTable', () => {
        fieldOps.hideFieldsTable(['field1', 'field3']);
        expect(feat.hiddenFields).toEqual(['field2']);
    });

    test('hideFields', () => {
        fieldOps.hideFields(['field1', 'field3']);
        expect(feat.layer.fields[0].visible).toBe(false);
        expect(feat.layer.fields[1].visible).toBe(true);
        expect(feat.layer.fields[2].visible).toBe(false);
    });

    test('findField', async () => {
        const field = await fieldOps.findField('field2');
        expect(field).toEqual({ name: 'field2', editable: true, visible: true });
    });

    test('deleteFields', () => {
        fieldOps.deleteFields(['field1', 'field3']);
        expect(feat.fields).toEqual([{ name: 'field2' }]);
    });
});