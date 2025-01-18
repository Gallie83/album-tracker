import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from "@testing-library/user-event";
import Navbar from "./Navbar";


describe("Navbar component - Authenticated", () => {

    beforeEach(() => {
        // Mock the auth context
        vi.mock('../../contexts/AuthContext/useAuth', () => ({
            useAuth: () => ({
                isAuthenticated: true,
                username: 'TestUser',
            })
        }));
    })

    it("opens and closes the navbar when VYNYL icon is clicked", async () => {
        const user = userEvent.setup()
        render(
            <MemoryRouter>
                    <Navbar />
            </MemoryRouter>
        );

        // Check if it opens on click
        const button = screen.getByTestId("navbar-button")
        await user.click(button);
        
        const nav = await screen.findByTestId("navbar")
        expect(nav).toBeInTheDocument()
        
        // Check if it closes on second click
        await user.click(button);
        
        expect(nav).not.toBeInTheDocument()
    })

    it("shows profile link when authenticated, and sends user to /profile", async () => {
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

        // Check Profile link is rendered and has correct 'to' destination
        const link = screen.getByText(/TestUser's Profile/i) 
        expect(link).toHaveAttribute("href", "/profile");
    });
});

describe("Navbar component - Unauthenticated", () => {

    beforeEach(() => {
        // Mock the auth context
        vi.mock('../../contexts/AuthContext/useAuth', () => ({
            useAuth: () => ({
                isAuthenticated: false,
                username: null,
            })
        }));
    })

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

        // screen.debug()

        const loginButton = await screen.findByText(/Login/i);
        user.click(loginButton)

        expect(mockAssign).toHaveBeenCalled()

        expect(mockAssign).toHaveBeenCalledWith(expect.stringContaining("us-east-1.amazoncognito.com/login"));
    })
})