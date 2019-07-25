const client = require('./client');

describe('client entity', () => {
    it('isset', () => {
        expect(client).toBeDefined();
    });
    it('build', () => {
        const instance = client.fromAuthData({username: 'test'});
        expect(instance).toBeDefined();
        expect(instance.name).toBe('test');
        expect(instance.accessLevel).toBe('user');
        expect(instance.token).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });
    it('views', () => {
        const instance = client.fromAuthData({username: 'test'});
        expect(instance.toString()).toMatch(/{"username":"test","token":".*","accessLevel":"user"}/);
    });
});