require('jaydata');
var Q = require('q');

var apiUrl = 'http://localhost:3000/contextapi.svc';
var serviceName = 'newsreader.svc';
var dbName = 'service';

JSON.prittify = function(o){
    return JSON.stringify(o, null, '    ');
};

require('../../JayDataModules/qDeferred.js');
require('../../JaySvcUtil/JaySvcUtil.js');

var connect = require('connect');
var app = connect();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type, MaxDataServiceVersion, DataServiceVersion');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, MERGE');
    if (req.method === 'OPTIONS') {
        res.end();
    } else {
        next();
    }
});

app.use(connect.query());
app.use($data.JayService.OData.BatchProcessor.connectBodyReader);

app.use('/refresh', function(req, res){
    initializeService(function(){
        console.log('Service ready.');
        console.log('Redirecting to "/' + serviceName + '/$metadata"');
        res.writeHead(302, {
          'Location': '/' + serviceName + '/$metadata'
        });
        res.end();
    });
});

app.use('/start', function(req, res){
    $data.MetadataLoader.debugMode = true;
    $data.MetadataLoader.load(apiUrl, function (factory, ctxType, text) {
        var context = new $data.ContextAPI.API({ name: 'oData', oDataServiceHost: apiUrl });
        //console.log(text);
        var db = { Name: 'NewsReader', Namespace: '$news.Types' };
        var database = new $data.ContextAPI.Database(db);
        context.Databases.add(database);
        
        context.saveChanges(function(){
            var category = new $data.ContextAPI.Entity({
                DatabaseID: database.DatabaseID,
                Name: 'Category',
                FullName: '$news.Types.Category',
                Namespace: '$news.Types'
            });
            var article = new $data.ContextAPI.Entity({
                DatabaseID: database.DatabaseID,
                Name: 'Article',
                FullName: '$news.Types.Article',
                Namespace: '$news.Types'
            });
            
            context.Entities.add(category);
            context.Entities.add(article);
            
            var categories = new $data.ContextAPI.EntitySet({ DatabaseID: database.DatabaseID, Name: 'Categories', ElementType: db.Namespace + '.' + category.Name });
            var articles = new $data.ContextAPI.EntitySet({ DatabaseID: database.DatabaseID, Name: 'Articles', ElementType: db.Namespace + '.' + article.Name });
            
            context.EntitySets.add(categories);
            context.EntitySets.add(articles);
            
            context.saveChanges(function(){
                context.EntityFields.add(new $data.ContextAPI.EntityField({ DatabaseID: database.DatabaseID, EntityID: category.EntityID, Name: 'Id', Type: 'id', Required: true, Key: true, Computed: true }));
                context.EntityFields.add(new $data.ContextAPI.EntityField({ DatabaseID: database.DatabaseID, EntityID: category.EntityID, Name: 'Title', Type: 'string' }));
                context.EntityFields.add(new $data.ContextAPI.EntityField({ DatabaseID: database.DatabaseID, EntityID: category.EntityID, Name: 'Articles', Type: 'Array', ElementType: 'id' }));
                
                context.EntityFields.add(new $data.ContextAPI.EntityField({ DatabaseID: database.DatabaseID, EntityID: article.EntityID, Name: 'Id', Type: 'id', Required: true, Key: true, Computed: true }));
                context.EntityFields.add(new $data.ContextAPI.EntityField({ DatabaseID: database.DatabaseID, EntityID: article.EntityID, Name: 'Title', Type: 'string' }));
                context.EntityFields.add(new $data.ContextAPI.EntityField({ DatabaseID: database.DatabaseID, EntityID: article.EntityID, Name: 'Lead', Type: 'string' }));
                context.EntityFields.add(new $data.ContextAPI.EntityField({ DatabaseID: database.DatabaseID, EntityID: article.EntityID, Name: 'Body', Type: 'string' }));
                context.EntityFields.add(new $data.ContextAPI.EntityField({ DatabaseID: database.DatabaseID, EntityID: article.EntityID, Name: 'CreateDate', Type: 'datetime' }));
                context.EntityFields.add(new $data.ContextAPI.EntityField({ DatabaseID: database.DatabaseID, EntityID: article.EntityID, Name: 'Thumbnail_LowRes', Type: 'blob' }));
                context.EntityFields.add(new $data.ContextAPI.EntityField({ DatabaseID: database.DatabaseID, EntityID: article.EntityID, Name: 'Thumbnail_HighRes', Type: 'blob' }));
                context.EntityFields.add(new $data.ContextAPI.EntityField({ DatabaseID: database.DatabaseID, EntityID: article.EntityID, Name: 'Category', Type: 'id' }));
                context.EntityFields.add(new $data.ContextAPI.EntityField({ DatabaseID: database.DatabaseID, EntityID: article.EntityID, Name: 'Tags', Type: 'Array', ElementType: 'string' }));
                
                context.saveChanges(function(){
                    res.end('ContextAPI ready.');
                    /*initializeService(function(){
                        console.log('Service ready.');
                    });*/
                });
            });
        });
    });
});

app.listen(3001);

function initializeService(callback){
    $data.MetadataLoader.debugMode = true;
    $data.MetadataLoader.load(apiUrl, function (factory, ctxType, text) {
        var context = factory();
        //var context = new $data.ContextAPI.API({ name: 'oData', oDataServiceHost: apiUrl });
        //console.log(text);
        
        Q.all([context.Entities.toArray(), context.EntitySets.toArray(), context.getContext(), context.getContextJS()])
        .then(function(value){
            var result = {
                entities: value[0],
                entitySets: value[1],
                ctx: value[2],
                js: value[3]
            };
            //console.log('data =>', JSON.prittify(result));
            console.log('\nStarting new context server:\n----------------------------\n');
            result.js = result.js.replace("'$news.Types.Context'", '$news.Types.Context');
            console.log(result.js);
            
            console.log('\nBuilding context');
            eval(result.js);
            
            $data.Class.defineEx('$news.Types.Service', [$news.Types.Context, $data.ServiceBase]);
            
            console.log('Publish service as "/' + serviceName + '"');
            
            app.use('/' + serviceName, $data.JayService.createAdapter($news.Types.Service, function(){
                return new $news.Types.Service({ name: 'mongoDB', databaseName: dbName });
            }));
            
            callback();
        });
    });
}
