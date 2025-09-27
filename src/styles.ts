import { definePreset } from '@primeng/themes';
import Aura from '@primeuix/themes/aura';

// Extend the type to allow numeric keys
interface ExtendedColorScheme {
    [key: string]: string;
}

export const MyPreset = definePreset(Aura, {
    semantic: {
        colorScheme: {
            light: {
                primary: {
                    50: '#e3f2fd',
                    100: '#bbdefb',
                    200: '#90caf9',
                    300: '#64b5f6',
                    400: '#42a5f5',
                    500: '#2196f3',
                    600: '#1e88e5',
                    700: '#1976d2',
                    800: '#1565c0',
                    900: '#0d47a1',
                    950: '#0b3d91'
                } as ExtendedColorScheme,
                highlight: {
                    background: '#1565c0',
                    focusBackground: '#1565c0',
                    color: '#ffffff',
                    focusColor: '#ffffff'
                }
            },
            dark: {
                primary: {
                    //cambiar a hexadecimal
                    50: '#d1fae5',
                    100: '#a7f3d0',
                    200: '#6ee7b7',
                    300: '#34d399',
                    400: '#10b981',
                    500: '#059669',
                    600: '#047857',
                    700: '#065f46',
                    800: '#064e3b',
                    900: '#064e3b',
                    950: '#064e3b'
                } as ExtendedColorScheme,
                highlight: {
                    /*
                    background: 'rgba(250, 250, 250, 0.16)',
                    focusBackground: 'rgba(250, 250, 250, 0.24)',
                    color: 'rgba(250, 250, 250, 0.87)',
                    focusColor: 'rgba(250, 250, 250, 0.87)'*/
                    background: '#10b981',
                    focusBackground: '#10b981',
                    color: '#ffffff',
                    focusColor: '#ffffff'
                }
            }
        }
    }
});