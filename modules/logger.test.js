const logger = require('./logger');
const configMock = {
    path: {
        log: '.'
    },
    time: {
        logSave: 1000
    }
};
logger.configure(configMock);

describe('logger test', () => {
    const spy = jest.spyOn(console, 'log');
    it('isset', () => {
       expect(logger).toBeDefined();
    });
    it('add', () => {
        logger.add('test', 'message');
        expect(spy.mock.calls.toString()).toBe("[test] message");
    });
});
