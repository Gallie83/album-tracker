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

        // Mock window.location.assign using Object.defineProperty
        const mockAssign = vi.fn();
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { assign: mockAssign },
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

        const loginButton = await screen.findByText(/Login/i);
        user.click(loginButton)

        console.log(mockAssign.mock.calls);

        expect(mockAssign).toHaveBeenCalledWith(expect.stringContaining("us-east-1.amazoncognito.com/login"));
    })
})