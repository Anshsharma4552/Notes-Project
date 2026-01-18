import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useCursor } from '../context/CursorContext';

const CustomCursor = () => {
    const { cursorType } = useCursor();
    const [isVisible, setIsVisible] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Spring config for the lagging outer circle
    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', moveCursor);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [cursorX, cursorY]);

    if (!isVisible) return null;

    // Variants for the outer ring based on cursor type
    const ringVariants = {
        default: {
            height: 40,
            width: 40,
            x: -20,
            y: -20,
            opacity: 0.5,
            borderWidth: '1px',
            backgroundColor: 'transparent',
            borderColor: '#FFFFFF'
        },
        pointer: {
            height: 60,
            width: 60,
            x: -30,
            y: -30,
            opacity: 1,
            borderWidth: '2px',
            backgroundColor: 'transparent',
            borderColor: '#FFFFFF'
        },
        text: {
            height: 30,
            width: 2,
            x: -1,
            y: -15,
            opacity: 1,
            borderWidth: '0px',
            backgroundColor: '#FFFFFF',
            borderColor: 'transparent',
            borderRadius: 0
        },
        card: {
            height: 80,
            width: 80,
            x: -40,
            y: -40,
            opacity: 0.2,
            borderWidth: '0px',
            backgroundColor: '#FFFFFF',
            borderColor: 'transparent'
        }
    };

    // Variants for the inner dot
    const dotVariants = {
        default: {
            opacity: 1,
            scale: 1,
            x: -3,
            y: -3
        },
        pointer: {
            opacity: 0,
            scale: 0.5,
            x: -3,
            y: -3
        },
        text: {
            opacity: 0,
            scale: 0,
            x: -3,
            y: -3
        },
        card: {
            opacity: 1,
            scale: 1.5,
            x: -3,
            y: -3
        }
    };

    return (
        <>
            {/* Outer Ring / Shape */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border-white mix-blend-difference"
                style={{
                    left: cursorXSpring,
                    top: cursorYSpring,
                }}
                variants={ringVariants}
                animate={cursorType}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />

            {/* Inner Dot - moves instantly */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] w-1.5 h-1.5 bg-white rounded-full mix-blend-difference"
                style={{
                    left: cursorX,
                    top: cursorY,
                }}
                variants={dotVariants}
                animate={cursorType}
                transition={{ duration: 0.1 }}
            />
        </>
    );
};

export default CustomCursor;
