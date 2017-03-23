import { CustomHttpRequestOptions } from './custom-http-request-options';

describe('Shared: CustomHttpRequestOptions', () => {
  describe('#constructor', () => {
    it('should set Content-Type and Accept headers for all requests', () => {
      let fixture = new CustomHttpRequestOptions(); 
      expect(fixture.headers).toBeDefined();
      expect(fixture.headers).not.toBeNull();
      expect(fixture.headers.has('Content-Type')).toBeTruthy();
      expect(fixture.headers.get('Content-Type')).toBe('application/json');
      expect(fixture.headers.has('Accept')).toBeTruthy();
      expect(fixture.headers.get('Accept')).toBe('application/json, text/plain, */*');
    });

    // TODO - Remove this test once the process.env issue with the next two has been resolved.  This one is redundant, and doesn't fully test the class.
    it('should set Crds-Api-Key header if EMBED_API_TOKEN is set in the environment, but not set if EMBED_API_TOKEN is not set in the environment', () => {
      let expectedToken = process.env.EMBED_API_TOKEN;

      let fixture = new CustomHttpRequestOptions();

      if (expectedToken) {
        expect(fixture.headers).toBeDefined();
        expect(fixture.headers).not.toBeNull();
        expect(fixture.headers.has('Crds-Api-Key')).toBeTruthy();
        expect(fixture.headers.get('Crds-Api-Key')).toBe(expectedToken);
      } else {
        expect(fixture.headers).toBeDefined();
        expect(fixture.headers).not.toBeNull();
        expect(fixture.headers.has('Crds-Api-Key')).toBeFalsy();
      }
    });

    // TODO - process.env.EMBED_API_TOKEN = 'token123' is not working, so this test will fail. Need to determine why process.env cannot be altered, when documentation states that it should be possible (https://nodejs.org/api/process.html#process_process_env)
    xit('should set Crds-Api-Key header if EMBED_API_TOKEN is set in the environment', () => {
      process.env.EMBED_API_TOKEN = 'token123';

      let fixture = new CustomHttpRequestOptions();
      expect(fixture.headers).toBeDefined();
      expect(fixture.headers).not.toBeNull();
      expect(fixture.headers.has('Crds-Api-Key')).toBeTruthy();
      expect(fixture.headers.get('Crds-Api-Key')).toBe('token123');
    });

    // TODO - delete process.env.EMBED_API_TOKEN is not working, so this test will fail. Need to determine why process.env cannot be altered, when documentation states that it should be possible (https://nodejs.org/api/process.html#process_process_env)
    xit('should not set Crds-Api-Key header if EMBED_API_TOKEN is not set in the environment', () => {
      delete process.env.EMBED_API_TOKEN;

      let fixture = new CustomHttpRequestOptions();
      expect(fixture.headers).toBeDefined();
      expect(fixture.headers).not.toBeNull();
      expect(fixture.headers.has('Crds-Api-Key')).toBeFalsy();
    });
  });
  
});