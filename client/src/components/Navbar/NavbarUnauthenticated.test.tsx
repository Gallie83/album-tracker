import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from 'vitest';
import userEvent from "@testing-library/user-event";
import Navbar from "./Navbar";

// Mock the auth context
vi.mock('../../contexts/AuthContext/useAuth', () => ({
    useAuth: () => ({
        isAuthenticated: false,
        username: null,
    })
}));

describe("Navbar component - Unauthenticated", () => {

    it("redirects user to Cognito to log in if not authenticated", async () => {

        // Mock window.location.replace
        const mockReplace = vi.fn();
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { replace: mockReplace },
        });

        const user = userEvent.setup()

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        // Open Navbar
        const button = screen.getByTestId("navbar-button")
        await user.click(button);

        screen.debug()

        // Click Login Button
        const loginButton = await screen.findByText(/Login/i);
        user.click(loginButton)

        vi.spyOn(Navbar.prototype, 'handleLogin').mockImplementation(mockReplace);

        // Check if window.location.replace was called with the correct URL
        expect(mockReplace).toHaveBeenCalledWith(
            expect.stringContaining("amazoncognito.com/login")
        );
    })
})