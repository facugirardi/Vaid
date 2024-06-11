/**
 * Changes the body attribute
 */
const changeHTMLAttribute = (attribute, value) => {
    if (document.body) document.body.setAttribute(attribute, value);
    return true;
}

/**
 * Make the layout interface
 */
// Constants
import {
    THEME_MODE,
    THEME_PRESET,
    THEME_LAYOUT,
    SIDEBAR_THEME,
    SIDEBAR_THEME_CAPTION,
    LAYOUT_THEME
} from "@/common/layoutConfig";

// Export functions
export { changeHTMLAttribute };
