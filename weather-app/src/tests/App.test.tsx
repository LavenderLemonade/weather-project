// Imports
import { describe, it, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// To Test
import App from '../App';

// Tests
describe('Renders main page correctly', async () => {
    /**
     * Resets all renders after each test
     */
    afterEach(() => {
        cleanup();
    });

    /**
     * Passes - shows title correctly
     */
    it('Should render the page correctly', async () => {
        // Setup
        await render(<App />);
        const h1 = await screen.queryByText('Weather in Your Loccation!');

        // Post Expectations
        waitFor(() => expect(h1).toBeInTheDocument());

    });

});