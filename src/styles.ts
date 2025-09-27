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
                    50: '{indigo.50}',
                    100: '{indigo.100}',
                    200: '{indigo.200}',
                    300: '{indigo.300}',
                    400: '{indigo.400}',
                    500: '{indigo.500}',
                    600: '{indigo.600}',
                    700: '{indigo.700}',
                    800: '{indigo.800}',
                    900: '{indigo.900}',
                    950: '{indigo.950}'
                } as ExtendedColorScheme,
                highlight: {
                    background: 'rgba(250, 250, 250, 0.16)',
                    focusBackground: 'rgba(250, 250, 250, 0.24)',
                    color: 'rgba(250, 250, 250, 0.87)',
                    focusColor: 'rgba(250, 250, 250, 0.87)'
                }
            }
        }
    }
});