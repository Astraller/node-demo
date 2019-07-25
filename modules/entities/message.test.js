const message = require('./message');

const clientMock = {
    name: 'tester',
    accessLevel: 'admin',
    token: 'not.token.at.all'
};

describe('message entity', () => {
    it('isset', () => {
        expect(message).toBeDefined();
    });
    it('build', () => {
        const instance = message.fromNetwork('test', clientMock);
        expect(instance).toBeDefined();
        expect(instance.text).toBe('test');
        expect(instance.author).toBe(clientMock);
    });
    it('views', () => {
        const instance = message.fromNetwork('test', clientMock);
        expect(instance.toString()).toMatch(/{"text":"test","author":"not.token.at.all","time":".*"}/);
        expect(instance.toSend()).toEqual({
            "author": "tester",
            "text": "test",
            "time": expect.stringMatching(/.*/)
        });
    });
});