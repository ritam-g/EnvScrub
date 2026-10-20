import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScrubberTool } from './components/ScrubberTool';

describe('ScrubberTool (React Testing Library Integration Tests)', () => {
  const writeTextMock = vi.fn().mockImplementation(() => Promise.resolve());

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    writeTextMock.mockClear();

    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: writeTextMock,
      },
      writable: true,
      configurable: true,
    });
  });

  it('1. Keep-values toggle switches output between sanitized and clean values', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ScrubberTool />);

    const textarea = screen.getByLabelText(/configuration input/i);

    // Type input
    await user.type(textarea, 'PORT=8080\nAPI_KEY="secret-123"');

    // Advance debounce timer (150ms)
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Default: Sanitize mode (Keep values OFF) -> values removed
    const outputPanel = screen.getByTestId('output-panel');
    expect(within(outputPanel).getByText(/PORT=\s*API_KEY=/i)).toBeInTheDocument();

    // Toggle Keep values ON
    const toggle = screen.getByRole('switch');
    await user.click(toggle);

    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Output now contains clean values
    expect(within(outputPanel).getByText(/PORT=8080/i)).toBeInTheDocument();
    expect(within(outputPanel).getByText(/API_KEY=secret-123/i)).toBeInTheDocument();
  });

  it('2. Per-key override selectively keeps a specific key while global is OFF', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ScrubberTool />);

    const textarea = screen.getByLabelText(/configuration input/i);
    await user.type(textarea, 'PORT=8080\nAPI_KEY=secret-123');

    act(() => {
      vi.advanceTimersByTime(250);
    });

    // In sanitize mode initially: both values removed
    const outputPanel = screen.getByTestId('output-panel');
    expect(within(outputPanel).getByText(/PORT=\s*API_KEY=/i)).toBeInTheDocument();

    // Find the override button for PORT and click it to keep its value
    const portOverride = screen.getByRole('button', {
      name: /toggle value retention for key PORT/i,
    });
    await user.click(portOverride);

    act(() => {
      vi.advanceTimersByTime(250);
    });

    // In output panel: PORT is now kept as 8080, while API_KEY remains sanitized!
    expect(within(outputPanel).getByText(/PORT=8080\s*API_KEY=/i)).toBeInTheDocument();
  });

  it('3. Copy button copies sanitized output and shows visual and accessible confirmation', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const writeSpy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    render(<ScrubberTool />);

    const textarea = screen.getByLabelText(/configuration input/i);
    await user.type(textarea, 'DATABASE_URL="postgres://user:pass@localhost:5432/db"');

    act(() => {
      vi.advanceTimersByTime(250);
    });

    const copyBtn = screen.getByRole('button', { name: /^copy$/i });
    expect(copyBtn).not.toBeDisabled();

    await user.click(copyBtn);

    // Allow async clipboard promise to resolve
    await act(async () => {
      await Promise.resolve();
    });

    // Clipboard API should have been called with sanitized content
    expect(writeSpy).toHaveBeenCalledWith('DATABASE_URL=');

    // UI displays "Copied!" feedback
    expect(screen.getByRole('button', { name: /copied!/i })).toBeInTheDocument();

    // Accessible aria-live announcement
    expect(
      screen.getByText(/copied sanitized configuration to clipboard/i)
    ).toBeInTheDocument();
  });
});
