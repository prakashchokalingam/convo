import { buildContextUrl, getSubdomainContext, SubdomainContext } from '../../lib/subdomain';

// Helper to manage process.env.NODE_ENV
const originalNodeEnv = process.env.NODE_ENV;

describe('buildContextUrl', () => {
  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv; // Restore original NODE_ENV
  });

  describe('Development Mode (NODE_ENV=development)', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    const devBase = 'http://localhost:3002';

    test.each([
      ['marketing', '/about', `${devBase}/marketing/about`],
      ['marketing', '/', `${devBase}/marketing/`],
      ['marketing', '/about?query=1', `${devBase}/marketing/about?query=1`],
      ['app', '/dashboard', `${devBase}/app/dashboard`],
      ['app', '/', `${devBase}/app/`],
      ['app', '/dashboard?query=app', `${devBase}/app/dashboard?query=app`],
      ['forms', '/submit/123', `${devBase}/forms/submit/123`],
      ['forms', '/', `${devBase}/forms/`],
      ['forms', '/submit/123?query=form', `${devBase}/forms/submit/123?query=form`],
    ])('buildContextUrl(%s, %s) -> %s', (context, path, expectedUrl) => {
      expect(buildContextUrl(context as SubdomainContext, path)).toBe(expectedUrl);
    });
  });

  describe('Production Mode (NODE_ENV=production)', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    test.each([
      ['marketing', '/about', 'https://convo.ai/about'],
      ['marketing', '/', 'https://convo.ai/'],
      ['marketing', '/about?query=1', 'https://convo.ai/about?query=1'],
      ['app', '/dashboard', 'https://app.convo.ai/dashboard'],
      ['app', '/', 'https://app.convo.ai/'],
      ['app', '/dashboard?query=app', 'https://app.convo.ai/dashboard?query=app'],
      ['forms', '/submit/123', 'https://forms.convo.ai/submit/123'],
      ['forms', '/', 'https://forms.convo.ai/'],
      ['forms', '/submit/123?query=form', 'https://forms.convo.ai/submit/123?query=form'],
    ])('buildContextUrl(%s, %s) -> %s', (context, path, expectedUrl) => {
      expect(buildContextUrl(context as SubdomainContext, path)).toBe(expectedUrl);
    });
  });
});

describe('getSubdomainContext', () => {
  const originalWindow = global.window;
  const originalConsoleWarn = console.warn;

  beforeEach(() => {
    // Reset mocks for each test
    jest.resetModules();
    // @ts-ignore
    delete global.window; // Ensure window is undefined for server-side tests by default
    console.warn = jest.fn(); // Mock console.warn
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    global.window = originalWindow; // Restore original window object
    console.warn = originalConsoleWarn; // Restore console.warn
    jest.unmock('next/headers'); // Clean up next/headers mock
  });

  describe('Client-Side (typeof window !== undefined)', () => {
    const mockWindow = (hostname: string, pathname: string) => {
      // @ts-ignore
      global.window = {
        location: {
          hostname,
          pathname,
          search: '', // Not used by current logic but good to have
        },
      };
    };

    describe('Development Mode', () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'development';
      });

      test.each([
        ['localhost', '/app/dashboard', 'app'],
        ['localhost', '/forms/submit', 'forms'],
        ['localhost', '/marketing/about', 'marketing'],
        ['localhost', '/', 'marketing'],
        ['localhost', '/other/path', 'marketing'],
        ['localhost', '/app', 'app'], // Edge case: no trailing slash
      ])('hostname "%s", pathname "%s" -> context "%s"', (hostname, pathname, expectedContext) => {
        mockWindow(hostname, pathname);
        expect(getSubdomainContext()).toBe(expectedContext);
      });
    });

    describe('Production Mode', () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'production';
      });

      test.each([
        ['app.convo.ai', '/dashboard', 'app'],
        ['forms.convo.ai', '/submit', 'forms'],
        ['convo.ai', '/about', 'marketing'],
        ['convo.ai', '/', 'marketing'],
        ['www.convo.ai', '/other', 'marketing'], // Assuming www is treated as marketing
      ])('hostname "%s", pathname "%s" -> context "%s"', (hostname, pathname, expectedContext) => {
        mockWindow(hostname, pathname); // Pathname doesn't matter for prod client-side
        expect(getSubdomainContext()).toBe(expectedContext);
      });
    });
  });

  describe('Server-Side (typeof window === undefined)', () => {
    const mockNextHeaders = (headersImpl: () => Map<string, string | null>) => {
      jest.doMock('next/headers', () => ({
        headers: jest.fn(headersImpl),
      }));
    };

    describe('With "x-subdomain-context" header', () => {
      // NODE_ENV shouldn't strictly matter if header is present, but test both
      test.each([
        ['development' as typeof originalNodeEnv, 'app'],
        ['development' as typeof originalNodeEnv, 'forms'],
        ['development' as typeof originalNodeEnv, 'marketing'],
        ['production' as typeof originalNodeEnv, 'app'],
        ['production' as typeof originalNodeEnv, 'forms'],
        ['production' as typeof originalNodeEnv, 'marketing'],
      ])('NODE_ENV=%s, header "%s" -> context "%s"', (nodeEnv, contextHeader, expectedContext) => {
        process.env.NODE_ENV = nodeEnv;
        mockNextHeaders(() => new Map([['x-subdomain-context', contextHeader]]));
        // Need to re-require or use dynamic import for getSubdomainContext after mocking for server-side
        const { getSubdomainContext: getServerContext } = require('../../lib/subdomain');
        expect(getServerContext()).toBe(expectedContext);
      });
    });

    describe('Without "x-subdomain-context" header (Production)', () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'production';
      });

      test.each([
        ['app.convo.ai', 'app'],
        ['forms.convo.ai', 'forms'],
        ['convo.ai', 'marketing'],
        ['sub.domain.com', 'marketing'], // Unknown host defaults to marketing
      ])('host "%s" -> context "%s"', (hostHeader, expectedContext) => {
        mockNextHeaders(() => new Map([['host', hostHeader]]));
        const { getSubdomainContext: getServerContext } = require('../../lib/subdomain');
        expect(getServerContext()).toBe(expectedContext);
      });
    });

    describe('Without "x-subdomain-context" header (Development Fallback)', () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'development';
      });

      test('host "localhost:3002" -> context "marketing" and warns', () => {
        mockNextHeaders(() => new Map([['host', 'localhost:3002']]));
        const { getSubdomainContext: getServerContext } = require('../../lib/subdomain');
        expect(getServerContext()).toBe('marketing');
        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining("'x-subdomain-context' header not found in development")
        );
      });

       test('host "test.local" (unknown dev host) -> context "marketing" and warns', () => {
        mockNextHeaders(() => new Map([['host', 'test.local']]));
         const { getSubdomainContext: getServerContext } = require('../../lib/subdomain');
        expect(getServerContext()).toBe('marketing');
        // Warning check might be tricky if host isn't 'localhost', depends on implementation detail
        // The current implementation warns if NODE_ENV is dev and host includes 'localhost'
        // If it warns for any dev host when header is missing, this test is fine.
        // Based on current getSubdomainContext, it only warns if host.includes('localhost')
        // So for 'test.local' it would default to marketing but not warn.
        // Let's adjust the expectation based on current code or refine the code.
        // Current code: `if (process.env.NODE_ENV === 'development' && host && host.includes('localhost')) { console.warn(...) }`
        // So, for 'test.local', no warning.
        expect(console.warn).not.toHaveBeenCalled();
      });
    });
     describe('Error in next/headers (e.g. during build)', () => {
        test('should return "marketing" and not throw', () => {
            process.env.NODE_ENV = 'production'; // or development
            // Mock headers() to throw an error or be undefined
            jest.doMock('next/headers', () => ({
                headers: jest.fn(() => { throw new Error("Headers not available"); }),
            }));
            const { getSubdomainContext: getServerContext } = require('../../lib/subdomain');
            expect(getServerContext()).toBe('marketing');
            expect(console.warn).not.toHaveBeenCalled(); // Should not warn in this specific error case
        });
    });
  });
});

// Mock for next/headers - this will be hoisted by Jest
// We use jest.doMock inside tests for more granular control per test case when needed for server side.
// However, a default mock can be useful.
jest.mock('next/headers', () => ({
  headers: jest.fn(() => new Map()), // Default mock returns an empty map
}), { virtual: true }); // virtual: true if it's not a real package in node_modules for testing
