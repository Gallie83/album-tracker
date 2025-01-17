import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../contexts/AuthContext/AuthContext";
import { describe, it, expect } from 'vitest';
import userEvent from "@testing-library/user-event";
import Navbar from "./Navbar";

describe("Navbar links", () => {

    it("Navbar opens and closes when VYNYL icon is clicked", async () => {
        const user = userEvent.setup()
        render(
        <MemoryRouter>
            <AuthProvider>
                <Navbar />
            </AuthProvider>
        </MemoryRouter>
        );

        const button = screen.getByTestId("navbar-button")
        await user.click(button);
        
        const nav = await screen.findByTestId("navbar")
        expect(nav).toBeInTheDocument()
        
        await user.click(button);
        
        expect(nav).not.toBeInTheDocument()
    })
})