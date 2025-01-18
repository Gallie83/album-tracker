import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from 'vitest';
import userEvent from "@testing-library/user-event";
import Navbar from "./Navbar";

// Mock the auth context
vi.mock('../../contexts/AuthContext/useAuth', () => ({
    useAuth: () => ({
        isAuthenticated: true,
        username: 'TestUser',
    })
}));

describe("Navbar component - Authenticated", () => {

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

        // Check Profile link is rendered and has correct 'to' destination
        const link = screen.getByText(/TestUser's Profile/i) 
        expect(link).toHaveAttribute("href", "/profile");
    });
});