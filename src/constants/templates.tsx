
// Template data with added customization options and animations
export const templatesLibrary = [
    {
        id: 'default',
        name: 'Default',
        description: 'The classic LinkBeacon layout with a clean, simple design.',
        previewImage: 'https://xkglfoncbxrpyrdiekzu.supabase.co/storage/v1/object/public/templates//template1.png',
        buttonStyle: 'default',
        fontFamily: 'default',
        backgroundType: 'gradient',
        backgroundConfig: {
            gradient: {
                from: '#f3e8ff',
                to: '#e9d5ff'
            }
        }
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'A clean, minimalist design with focus on your content.',
        previewImage: 'https://xkglfoncbxrpyrdiekzu.supabase.co/storage/v1/object/public/templates//template2.png',
        buttonStyle: 'minimal',
        fontFamily: 'default',
        backgroundType: 'color',
        backgroundConfig: {
            color: '#ffffff'
        }
    },
    {
        id: 'elegant-dark',
        name: 'Elegant Dark',
        description: 'A sophisticated dark theme with a premium feel.',
        previewImage: 'https://xkglfoncbxrpyrdiekzu.supabase.co/storage/v1/object/public/templates//template3.png',
        buttonStyle: 'outline',
        fontFamily: 'lobster',
        backgroundType: 'color',
        backgroundConfig: {
            color: '#111827'
        }
    },
    {
        id: 'gradient',
        name: 'Gradient',
        description: 'A vibrant background with gradient colors that pop.',
        previewImage: 'https://xkglfoncbxrpyrdiekzu.supabase.co/storage/v1/object/public/templates//gradient%20template%20pink.png',
        buttonStyle: 'gradient',
        fontFamily: 'display',
        backgroundType: 'gradient',
        backgroundConfig: {
            gradient: {
                from: '#a855f7',
                to: '#ec4899'
            }
        }
    },
    {
        id: 'bubbles',
        name: 'Bubbles',
        description: 'A fun, playful design with a light blue theme.',
        previewImage: 'https://via.placeholder.com/300x200/e6f7ff/4a90e2?text=Bubbles',
        buttonStyle: 'rounded',
        fontFamily: 'font-lobster',
        backgroundType: 'color',
        backgroundConfig: {
            color: '#eff6ff'
        }
    },
    {
        id: 'modern',
        name: 'Modern',
        description: 'A contemporary layout with a sleek side profile.',
        previewImage: 'https://via.placeholder.com/300x200/f5f5f5/808080?text=Modern',
        buttonStyle: 'shadow',
        fontFamily: 'mono',
        backgroundType: 'color',
        backgroundConfig: {
            color: '#f5f5f5'
        }
    },
    // New templates with animations
    {
        id: 'floating-particles',
        name: 'Floating Particles',
        description: 'Elegant background with animated floating particles.',
        previewImage: 'https://via.placeholder.com/300x200/000022/ffffff?text=Particles',
        buttonStyle: 'gradient',
        fontFamily: 'raleway',
        hasAnimation: true,
        animationType: 'particles',
        backgroundType: 'animated',
        backgroundConfig: {
            animation: 'particles',
            baseColor: '#000022'
        }
    },
    {
        id: 'wave-background',
        name: 'Wave Background',
        description: 'Soothing animated wave patterns in the background.',
        previewImage: 'https://via.placeholder.com/300x200/003366/ffffff?text=Waves',
        buttonStyle: 'default',
        fontFamily: 'poppins',
        hasAnimation: true,
        animationType: 'waves',
        backgroundType: 'animated',
        backgroundConfig: {
            animation: 'waves',
            baseColor: '#003366'
        }
    },
    {
        id: 'gradient-flow',
        name: 'Gradient Flow',
        description: 'Smoothly transitioning color gradients that create depth.',
        previewImage: 'https://via.placeholder.com/300x200/4b0082/ffffff?text=Flow',
        buttonStyle: 'minimal',
        fontFamily: 'lobster',
        hasAnimation: true,
        animationType: 'gradientFlow',
        backgroundType: 'animated',
        backgroundConfig: {
            animation: 'gradientFlow',
            baseColor: '#4b0082'
        }
    },
    {
        id: 'gradient-blue-flow',
        name: 'Gradient Blue Flow',
        description: 'Smoothly transitioning color gradients that create depth.',
        previewImage: 'https://via.placeholder.com/300x200/4b0082/ffffff?text=Flow',
        buttonStyle: 'modern',
        fontFamily: 'lobster',
        hasAnimation: true,
        animationType: 'gradientBlueFlow',
        backgroundType: 'animated',
        backgroundConfig: {
            animation: 'gradientBlueFlow',
            baseColor: '#0066cc'
        }
    },
    // New image background template
    {
        id: 'nature-scene',
        name: 'Nature Scene',
        description: 'Beautiful nature background with overlay for readability.',
        previewImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        buttonStyle: 'shadow',
        fontFamily: 'poppins',
        backgroundType: 'image',
        backgroundConfig: {
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            overlay: 'rgba(0, 0, 0, 0.3)'
        }
    }
];
