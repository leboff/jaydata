$data.Entity.extend('$data.ContextAPI.Entity', {
    DatabaseID: { type: 'id', required: true },
    EntityID: { type: 'id', key: true, computed: true },
    Name: { type: 'string', required: true },
    FullName: { type: 'string', required: true },
    Namespace: { type: 'string' }/*,
    Fields: { type: 'Array', elementType: '$data.ContextAPI.EntityField' },
    Fields: { type: 'Array', elementType: '$data.ContextAPI.EntityField' },
    EntitySets: { type: 'Array', elementType: '$data.ContextAPI.EntitySet', inverseProperty: 'ElementType' }*/
});

$data.Entity.extend('$data.ContextAPI.EntityField', {
    DatabaseID: { type: 'id', required: true },
    EntityFieldID: { type: 'id', key: true, computed: true },
    EntityID: { type: 'id', required: true },
    Name: { type: 'string', required: true },
    Type: { type: 'string', required: true },
    ElementType: { type: 'string' },
    InverseProperty: { type: 'string' },
    Key: { type: 'bool' },
    Computed: { type: 'bool' },
    Nullable: { type: 'bool' },
    Required: { type: 'bool' },
    CustomValidator: { type: 'string' },
    MinValue: { type: 'string' },
    MaxValue: { type: 'string' },
    MinLength: { type: 'int' },
    MaxLength: { type: 'int' },
    Length: { type: 'int' },
    RegExp: { type: 'string' },
    ExtensionAttributes: { type: 'Array', elementType: '$data.ContextAPI.KeyValuePair' }/*,
    Entity: { type: '$data.ContextAPI.Entity', required: true, inverseProperty: 'Fields' }*/
});

$data.ContextAPI.Entity.extend('$data.ContextAPI.ComplexType');

$data.Entity.extend('$data.ContextAPI.KeyValuePair', {
    Key: { type: 'string' },
    Value: { type: 'string' }
});

$data.Entity.extend('$data.ContextAPI.ServiceOperationReturnType', {
    ReturnType: { type: 'string', required: true },
    ElementType: { type: 'string' }
});

$data.Entity.extend('$data.ContextAPI.ServiceOperationParameter', {
    ParameterID: { type: 'id', key: true, computed: true },
    Rank: { type: 'int', required: true },
    Name: { type: 'string', required: true },
    Type: { type: 'string', required: true }/*,
    ServiceOperation: { type: '$data.ContextAPI.ServiceOperation', inverseProperty: 'Parameters', required: true }*/
});

$data.Entity.extend('$data.ContextAPI.ServiceOperation', {
    ServiceOperationID: { type: 'id', key: true, computed: true },
    Name: { type: 'string', required: true },
    //Parameters: { type: 'Array', elementType: '$data.ContextAPI.ServiceOperationParameter' },
    Method: { type: 'string' },
    Returns: { type: '$data.ContextAPI.ServiceOperationReturnType' },
    Promise: { type: 'bool' },
    Publish: { type: 'bool' }
});

$data.Entity.extend('$data.ContextAPI.EventHandler', {
    EventHandlerID: { type: 'id', key: true, computed: true },
    Type: { type: 'string', required: true },
    Handler: { type: 'string', required: true }/*,
    EntitySet: { type: '$data.ContextAPI.EntitySet', inverseProperty: 'EventHandlers', required: true }*/
});

$data.Entity.extend('$data.ContextAPI.EntitySet', {
    DatabaseID: { type: 'id', required: true },
    EntitySetID: { type: 'id', key: true, computed: true },
    Name: { type: 'string', required: true },
    ElementType: { type: 'string', required: true },
    //ElementTypeID: { type: 'id', required: true },
    TableName: { type: 'string' },
    //EventHandlers: { type: 'Array', elementType: '$data.ContextAPI.EventHandler' },
    //ElementType: { type: '$data.ContextAPI.Entity', required: true },
    Publish: { type: 'bool' }
});

/*$data.Entity.extend('$data.ContextAPI.EntityContext', {
    EntityContextID: { type: 'id', key: true, computed: true },
    FullName: { type: 'string' },
    EntitySetID: { type: 'id' },
    EntitySet: { type: 'string' }
})*/

$data.Entity.extend('$data.ContextAPI.Database', {
    DatabaseID: { type: 'id', key: true, computed: true },
    Name: { type: 'string', required: true },
    Namespace: { type: 'string', required: true }
})

$data.EntityContext.extend('$data.ContextAPI.Context', {
    Databases: { type: $data.EntitySet, elementType: $data.ContextAPI.Database },
    Entities: { type: $data.EntitySet, elementType: $data.ContextAPI.Entity },
    ComplexTypes: { type: $data.EntitySet, elementType: $data.ContextAPI.ComplexType },
    EntityFields: { type: $data.EntitySet, elementType: $data.ContextAPI.EntityField },
    EventHandlers: { type: $data.EntitySet, elementType: $data.ContextAPI.EventHandler },
    EntitySets: { type: $data.EntitySet, elementType: $data.ContextAPI.EntitySet },
    ServiceParameters: { type: $data.EntitySet, elementType: $data.ContextAPI.ServiceOperationParameter },
    ServiceOperations: { type: $data.EntitySet, elementType: $data.ContextAPI.ServiceOperation }
    
});
