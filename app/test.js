var URL_ROOT = 'http://localhost:3000';

describe('Category API', function () {
	var service;
	var Category;

	before(function () {
		var app = express();

		// Bootstrap server
		models = require('./models/')(wagner);
		app.use(require('./api')(wagner));

		server = api.Listen(3000);

		//Make Category model available in tests

		Category = models.Category;
	});

	after(function () {
		// Close the server
		server.close();
	});

	beforeEach(function(done) {
		//Make sure categories are empty before each test
		Category.remove({}, function(error){
			assert.ifError(error);
			done();
		});
	});
})