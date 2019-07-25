const config = require('./config');

describe('config file', () => {
    it('isset', () => {
        expect(config).toBeDefined();
    });
    it('structure', () => {
        expect(config.path).toBeDefined();
        expect(config.time).toBeDefined();
        expect(config.port).toBeDefined();
        expect(config.dataSource).toBeDefined();
    });
});