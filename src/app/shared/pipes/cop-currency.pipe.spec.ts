import { CopCurrencyPipe } from './cop-currency.pipe';

describe('CopCurrencyPipe', () => {
  let pipe: CopCurrencyPipe;

  beforeEach(() => {
    pipe = new CopCurrencyPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format number as COP currency with prefix by default', () => {
    expect(pipe.transform(500000)).toBe('COP $500.000');
  });

  it('should format number as currency without COP prefix if showPrefix is false', () => {
    expect(pipe.transform(500000, false)).toBe('$500.000');
  });

  it('should format large numbers correctly', () => {
    expect(pipe.transform(1250000)).toBe('COP $1.250.000');
  });

  it('should handle zero correctly', () => {
    expect(pipe.transform(0)).toBe('COP $0');
  });

  it('should handle null correctly', () => {
    expect(pipe.transform(null)).toBe('COP $0');
  });

  it('should handle undefined correctly', () => {
    expect(pipe.transform(undefined)).toBe('COP $0');
  });

  it('should handle null without prefix correctly', () => {
    expect(pipe.transform(null, false)).toBe('$0');
  });
});
