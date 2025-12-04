import { extendTheme } from "@chakra-ui/react";
import { CardComponent } from "./additions/card/card";
import { buttonStyles } from "./components/button";
import { badgeStyles } from "./components/badge";
import { inputStyles } from "./components/input";
import { progressStyles } from "./components/progress";
import { sliderStyles } from "./components/slider";
import { textareaStyles } from "./components/textarea";
import { switchStyles } from "./components/switch";
import { linkStyles } from "./components/link";
import { globalStyles } from "./styles";

const theme = extendTheme(
  globalStyles,
  badgeStyles, // badge styles
  buttonStyles, // button styles
  linkStyles, // link styles
  progressStyles, // progress styles
  sliderStyles, // slider styles
  inputStyles, // input styles
  textareaStyles, // textarea styles
  switchStyles, // switch styles
  CardComponent // card component
);

// Helper to make theme properties mutable for ThemeEditorProvider
const makeMutable = (obj, visited = new WeakSet()) => {
  // Handle primitives, null, and functions
  if (obj === null || typeof obj !== 'object' || typeof obj === 'function') {
    return obj;
  }
  
  // Prevent circular references
  if (visited.has(obj)) {
    return obj;
  }
  visited.add(obj);
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => makeMutable(item, visited));
  }
  
  // Create a new plain object (not using Object.create to avoid prototype issues)
  const mutable = {};
  
  // Get all own property names (including non-enumerable)
  const keys = Object.getOwnPropertyNames(obj);
  
  for (const key of keys) {
    try {
      const descriptor = Object.getOwnPropertyDescriptor(obj, key);
      const value = obj[key];
      
      // Skip if it's a getter/setter and we can't handle it
      if (descriptor && (descriptor.get || descriptor.set)) {
        continue;
      }
      
      // Special handling for objects that might be frozen
      if (value && typeof value === 'object' && !visited.has(value)) {
        mutable[key] = makeMutable(value, visited);
      } else {
        mutable[key] = value;
      }
    } catch (e) {
      // If we can't access the property, skip it
      try {
        mutable[key] = obj[key];
      } catch (e2) {
        // Skip this property
      }
    }
  }
  
  // Also copy enumerable properties that might not be in getOwnPropertyNames
  for (const key in obj) {
    if (!mutable.hasOwnProperty(key)) {
      try {
        const value = obj[key];
        if (value && typeof value === 'object' && !visited.has(value)) {
          mutable[key] = makeMutable(value, visited);
        } else {
          mutable[key] = value;
        }
      } catch (e) {
        // Skip this property
      }
    }
  }
  
  return mutable;
};

// Create a mutable version of the theme
const mutableTheme = makeMutable(theme);

// Explicitly ensure breakpoints are fully mutable
// Chakra UI tries to modify breakpoints.base, so we need to ensure it's mutable
if (mutableTheme.breakpoints) {
  // Create a completely new breakpoints object
  const breakpointsClone = {};
  
  // Copy all properties from the original breakpoints
  for (const key in mutableTheme.breakpoints) {
    if (mutableTheme.breakpoints.hasOwnProperty(key)) {
      const value = mutableTheme.breakpoints[key];
      
      // Special handling for 'base' - create a completely new object
      if (key === 'base' && value && typeof value === 'object') {
        const baseClone = {};
        for (const baseKey in value) {
          if (value.hasOwnProperty(baseKey)) {
            baseClone[baseKey] = value[baseKey];
          }
        }
        breakpointsClone[key] = baseClone;
      } else {
        breakpointsClone[key] = value;
      }
    }
  }
  
  // Replace the breakpoints with the mutable clone
  mutableTheme.breakpoints = breakpointsClone;
  
  // Ensure breakpoints.base is directly mutable by redefining it
  if (breakpointsClone.base) {
    const baseValue = breakpointsClone.base;
    delete breakpointsClone.base;
    breakpointsClone.base = baseValue;
  }
}

// Export both the original theme and a mutable version
export default theme;
export { mutableTheme };
