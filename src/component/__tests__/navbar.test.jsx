import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/i18n';
import Navbar from '../navbar';

// Mock localStorage
const mockLocalStorage = {
    removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
});

// Mock window.location.reload
delete window.location;
window.location = { reload: jest.fn() };

const renderNavbar = () => {
    return render(
        <BrowserRouter>
            <I18nextProvider i18n={i18n}>
                <Navbar />
            </I18nextProvider>
        </BrowserRouter>
    );
};

describe('Navbar Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders navbar with all navigation items', () => {
        renderNavbar();
        
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Theatres')).toBeInTheDocument();
        expect(screen.getByText('TV Shows')).toBeInTheDocument();
        expect(screen.getByText('Collections')).toBeInTheDocument();
        expect(screen.getByText('Log Out')).toBeInTheDocument();
    });

    test('shows TV show submenu on hover', () => {
        renderNavbar();
        
        const tvShowMenu = screen.getByText('TV Shows').closest('li');
        fireEvent.mouseEnter(tvShowMenu);
        
        expect(screen.getByText('Popular')).toBeInTheDocument();
        expect(screen.getByText('Top Rated')).toBeInTheDocument();
        expect(screen.getByText('Airing Today')).toBeInTheDocument();
        expect(screen.getByText('On The Air')).toBeInTheDocument();
    });

    test('handles logout correctly', () => {
        renderNavbar();
        
        const logoutButton = screen.getByText('Log Out');
        fireEvent.click(logoutButton);
        
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user-info');
        expect(window.location.reload).toHaveBeenCalled();
    });

    test('has proper accessibility attributes', () => {
        renderNavbar();
        
        const nav = screen.getByRole('navigation');
        expect(nav).toHaveAttribute('aria-label', 'Main navigation');
        
        const logoutButton = screen.getByRole('button', { name: /log out/i });
        expect(logoutButton).toHaveAttribute('aria-label', 'Log out from application');
    });

    test('applies correct CSS classes for active navigation items', () => {
        renderNavbar();
        
        // Home should be active by default
        const homeLink = screen.getByText('Home').closest('li');
        expect(homeLink).toHaveClass('focusNavbar');
    });
});
