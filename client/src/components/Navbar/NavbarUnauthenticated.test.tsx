import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from "@testing-library/user-event";
import Navbar from "./Navbar";
import { AuthContext, AuthState } from "../../contexts/AuthContext/AuthContext";

// Mock the auth context
const mockAuthContextValue: AuthState = {
    isAuthenticated: false,
    username: null,
    email: null,
}

describe("Navbar component - Unauthenticated", () => {

    const oldWindowLocation = window.location;
    const replaceSpy = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        
        // Mock window.location with a spy for replace
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { 
                pathname: '/current-page',
                replace: replaceSpy
            },
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: oldWindowLocation,
        });
    });

    it("redirects user to Cognito to log in if not authenticated", async () => {
        const user = userEvent.setup()

        render(
            <MemoryRouter>
                <AuthContext.Provider value={mockAuthContextValue}>
                    <Navbar />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        // Open Navbar
        const button = screen.getByTestId("navbar-button")
        await user.click(button);

        // Click Login Button
        const loginButton = await screen.findByText(/Login/i);
        user.click(loginButton)

        // Check if window.location.replace was called with the correct URL
        expect(replaceSpy).toHaveBeenCalledWith(
            expect.stringContaining("http://localhost:5000/login")
        );
    })
})