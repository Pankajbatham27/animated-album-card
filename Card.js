import { useEffect, useState } from 'react';
import style from './Card.module.css';
import { getColor } from 'color-thief-react';


const Card = ({imageUrl}) => {

    const [dominantColor, setDominantColor] = useState();
    const [lightenedColor, setLightenedColor] = useState();



    function lightenColor(color, amount) {
        // Parse the color string and extract RGB values
        const regex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
        const result = regex.exec(color);
        const rgb = result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;

        if (!rgb) {
            // Invalid color format, return the original color
            return color;
        }

        // Lighten the RGB values
        const lightenedRgb = {
            r: lightenValue(rgb.r, amount),
            g: lightenValue(rgb.g, amount),
            b: lightenValue(rgb.b, amount)
        };

        // Convert the RGB values back to a hexadecimal string
        const lightenedColor = `#${componentToHex(lightenedRgb.r)}${componentToHex(lightenedRgb.g)}${componentToHex(lightenedRgb.b)}`;

        return lightenedColor;
    }

    function lightenValue(value, amount) {
        // Increase the value by a percentage of the maximum (255)
        const newValue = Math.round(value + (255 - value) * amount);
        // Ensure the new value stays within the valid range
        return Math.min(newValue, 255);
    }

    function componentToHex(component) {
        const hex = component.toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
    }


    useEffect(() => {
        const fetchDominantColor = async () => {
            try {
                const dominantColor = await getColor(imageUrl, 'hex');

                const lightenedColor = lightenColor(dominantColor, 0.2);
                setDominantColor(dominantColor);
                setLightenedColor(lightenedColor);


            } catch (error) {
                console.error('Error extracting color:', error);
            }
        };

        fetchDominantColor();
    }, [imageUrl]);

    return (
        <div className={style.coverCard}>
            <div className={style.forTextCard}>
                <div style={{ backgroundColor: dominantColor }} className={style.topSlide}>
                    <div style={{ backgroundColor: lightenedColor }} className={style.middleSlide}>
                        <div className={style.imageOnly}>
                        <img src={imageUrl} />
                        </div>
                    </div>
                </div>
                <div className={style.textStyle}>
                    <h5>Card Title</h5>
                    <p style={{marginBottom: '0px'}}>What's New</p>
                </div>
            </div>



        </div>
    )
}
export default Card;
