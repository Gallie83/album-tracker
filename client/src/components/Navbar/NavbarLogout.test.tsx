import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from "@testing-library/user-event";
import Navbar from "./Navbar";
import { AuthContext, AuthState } from "../../contexts/AuthContext/AuthContext";

// Mock the auth context
const mockAuthContextValue: AuthState = {
    isAuthenticated: true,
    username: 'TestUser',
    email: 'testing@test.com',
    logout: () => {
        window.location.href = 'http://localhost:5000/logout';
        }
}

describe("Navbar component - Logout functionality", () => {

    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm');

    // Store original window location
    const oldWindowLocation = window.location;
    
    beforeEach(() => {
        vi.clearAllMocks();
        confirmSpy.mockImplementation(() => true);

        // Mock location object
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { href: '' },
        });
    });

    afterEach(() => {
        // Restore original location
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: oldWindowLocation,
        });
    });


    it("shows the logout button that logs the user out", async () => {
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

        // search for Logout button and click
        const logoutButton = screen.getByText(/Logout/i) 
        await user.click(logoutButton)

        expect(confirmSpy).toHaveBeenCalled();
        expect(window.location.href).toBe('http://localhost:5000/logout');

    })

});