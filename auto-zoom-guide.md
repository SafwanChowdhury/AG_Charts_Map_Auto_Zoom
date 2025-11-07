# Auto Zoom Implementation Guide

This document explains how the auto zoom functionality works in the AG Charts map application. When a user selects a country from the dropdown, the map automatically zooms to that country's center point with configurable zoom level, padding, and offsets.

## Overview

The auto zoom feature uses AG Charts' Chart State API to programmatically control the map's zoom level and viewport. Instead of using geographic bounds (latitude/longitude ranges), this implementation uses **center points** and calculates zoom bounds around them using ratio-based coordinates.

## Key Components

### 1. Zoom Configuration

Located at the top of `App.tsx`, the `zoomConfig` object controls zoom behavior:

```typescript
const zoomConfig = {
  zoomLevel: 0.15,        // Zoom amount: smaller = more zoomed in (0.1 = very zoomed, 0.3 = less zoomed)
  padding: 0.1,           // Padding around the zoomed area (0.1 = 10% padding)
  offsetX: 0,             // Horizontal offset: positive = shift right, negative = shift left
  offsetY: -0.20,         // Vertical offset: positive = shift up, negative = shift down
};
```

**Parameters:**
- `zoomLevel`: Controls how much to zoom in. Smaller values (0.1) zoom in more, larger values (0.3) zoom in less.
- `padding`: Adds space around the zoomed area as a percentage (0.1 = 10% padding on each side).
- `offsetX`: Shifts the viewport horizontally. Positive values shift right, negative shift left.
- `offsetY`: Shifts the viewport vertically. Positive values shift up, negative shift down.

### 2. Country Center Points Extraction

The application extracts country center points from the `globeData` topology:

```typescript
const countryCenters = useMemo(() => {
  const centers: Record<string, { lng: number; lat: number }> = {};
  const features = globeData?.features ?? [];
  for (const feature of features) {
    const name = feature?.properties?.name;
    const labelX = feature?.properties?.label_x;  // Longitude
    const labelY = feature?.properties?.label_y;  // Latitude
    
    if (name && typeof labelX === 'number' && typeof labelY === 'number') {
      centers[name] = { lng: labelX, lat: labelY };
    }
  }
  return centers;
}, []);
```

This creates a lookup table mapping country names to their geographic center coordinates (longitude and latitude).

### 3. Zoom Function: `zoomToCountry`

The core zoom logic is implemented in the `zoomToCountry` function:

#### Step 1: Validation
```typescript
if (!chartRef.current || !countryName) {
  return;
}
const center = countryCenters[countryName];
if (!center) {
  console.warn(`No center point found for country: ${countryName}`);
  return;
}
```

#### Step 2: Convert Geographic Coordinates to Ratios

The function converts latitude/longitude coordinates to ratio coordinates (0-1 range):

```typescript
const WORLD_LNG_MIN = -180;
const WORLD_LNG_MAX = 180;
const WORLD_LNG_RANGE = WORLD_LNG_MAX - WORLD_LNG_MIN; // 360

const WORLD_LAT_MIN = -90;
const WORLD_LAT_MAX = 90;
const WORLD_LAT_RANGE = WORLD_LAT_MAX - WORLD_LAT_MIN; // 180

let centerRatioX = (center.lng - WORLD_LNG_MIN) / WORLD_LNG_RANGE;
let centerRatioY = (center.lat - WORLD_LAT_MIN) / WORLD_LAT_RANGE;
```

**Why ratios?** AG Charts' zoom state API accepts ratio coordinates (0-1) where:
- `0` represents the minimum bound (left/bottom)
- `1` represents the maximum bound (right/top)

#### Step 3: Apply Offsets

The configured offsets are applied to adjust the center point:

```typescript
centerRatioX += zoomConfig.offsetX;
centerRatioY += zoomConfig.offsetY;

// Clamp to valid range [0, 1]
centerRatioX = Math.max(0, Math.min(1, centerRatioX));
centerRatioY = Math.max(0, Math.min(1, centerRatioY));
```

This allows fine-tuning the viewport position (e.g., shifting down to better frame a country).

#### Step 4: Calculate Zoom Bounds

The function calculates symmetric bounds around the adjusted center:

```typescript
// Calculate total range including padding
const totalRange = zoomConfig.zoomLevel * (1 + zoomConfig.padding * 2);

// Calculate symmetric bounds around the adjusted center ratio
const ratios = {
  ratioX: {
    start: Math.max(0, centerRatioX - totalRange / 2),
    end: Math.min(1, centerRatioX + totalRange / 2)
  },
  ratioY: {
    start: Math.max(0, centerRatioY - totalRange / 2),
    end: Math.min(1, centerRatioY + totalRange / 2)
  }
};
```

**How it works:**
- `totalRange` includes the zoom level plus padding on both sides
- The bounds are calculated symmetrically around the center point
- `Math.max(0, ...)` and `Math.min(1, ...)` ensure bounds stay within valid range

#### Step 5: Apply Zoom State

Finally, the zoom state is applied using AG Charts' `setState` API:

```typescript
const currentState = chartRef.current.getState?.();
const version = currentState?.version || '12.3.1';

const stateToSet = {
  version: version,
  zoom: {
    ratioX: ratios.ratioX,
    ratioY: ratios.ratioY
  }
};

await chartRef.current.setState(stateToSet);
```

The version is extracted from the current chart state to ensure compatibility.

### 4. Reset Zoom Function

The `resetZoom` function resets the map to world view:

```typescript
const resetState = {
  version: version,
  zoom: {
    ratioX: { start: 0, end: 1 },
    ratioY: { start: 0, end: 1 }
  }
};
await chartRef.current.setState(resetState);
```

Setting ratios from 0 to 1 shows the entire world map.

### 5. Integration with UI

The zoom is triggered when a country is selected:

```typescript
const handleCountryChange = async (value: string) => {
  setSelectedCountry(value);
  
  if (value && countryCenters[value]) {
    await zoomToCountry(value);
  }
};
```

The country selection also triggers highlighting via the `itemStyler` in the chart options.

## Zoom Configuration Examples

### Very Zoomed In (Close-up)
```typescript
const zoomConfig = {
  zoomLevel: 0.05,   // Very small = very zoomed
  padding: 0.05,     // Minimal padding
  offsetX: 0,
  offsetY: 0,
};
```

### Medium Zoom
```typescript
const zoomConfig = {
  zoomLevel: 0.15,   // Current default
  padding: 0.1,
  offsetX: 0,
  offsetY: -0.20,    // Shift down slightly
};
```

### Wide View (Less Zoomed)
```typescript
const zoomConfig = {
  zoomLevel: 0.3,    // Larger = less zoomed
  padding: 0.15,     // More padding
  offsetX: 0,
  offsetY: 0,
};
```

## How the Math Works

### Coordinate Conversion Example

For a country at longitude `-2.0` and latitude `54.0` (approximately UK):

1. **Convert to ratios:**
   - `centerRatioX = (-2.0 - (-180)) / 360 = 178 / 360 ≈ 0.494`
   - `centerRatioY = (54.0 - (-90)) / 180 = 144 / 180 = 0.8`

2. **Apply offset (offsetY = -0.20):**
   - `centerRatioX = 0.494` (unchanged)
   - `centerRatioY = 0.8 + (-0.20) = 0.6`

3. **Calculate bounds (zoomLevel = 0.15, padding = 0.1):**
   - `totalRange = 0.15 * (1 + 0.1 * 2) = 0.15 * 1.2 = 0.18`
   - `ratioX.start = 0.494 - 0.18/2 = 0.494 - 0.09 = 0.404`
   - `ratioX.end = 0.494 + 0.18/2 = 0.494 + 0.09 = 0.584`
   - `ratioY.start = 0.6 - 0.18/2 = 0.6 - 0.09 = 0.51`
   - `ratioY.end = 0.6 + 0.18/2 = 0.6 + 0.09 = 0.69`

## Chart State API

The implementation uses AG Charts' Chart State API:

- **`getState()`**: Retrieves the current chart state, including zoom level and version
- **`setState(state)`**: Applies a new chart state, including zoom configuration

The state object structure:
```typescript
{
  version: string,        // Chart version (e.g., '12.3.1')
  zoom: {
    ratioX: { start: number, end: number },  // Horizontal zoom range (0-1)
    ratioY: { start: number, end: number }   // Vertical zoom range (0-1)
  }
}
```

## Animation

The zoom transition **should be animated** when using `setState()` if animation is enabled in the chart options:

```typescript
animation: {
  enabled: true,
  duration: 1000  // 1 second animation (1000ms)
}
```

**Current Implementation:** Animation is enabled with a 1-second duration. When you call `zoomToCountry()`, AG Charts should automatically animate the transition from the current zoom level to the new zoom level.

**To Verify Animation:**
- Select a country from the dropdown
- Watch for a smooth zoom transition (should take ~1 second)
- If it jumps instantly, the animation may not be working as expected

**Adjusting Animation Speed:**
- Increase `duration` for slower animation (e.g., `2000` for 2 seconds)
- Decrease `duration` for faster animation (e.g., `500` for 0.5 seconds)
- Set `enabled: false` to disable animation entirely (instant jump)

**Note:** According to AG Charts documentation, `setState()` should respect the animation configuration. However, if animations aren't working, you may need to check:
1. AG Charts version compatibility
2. Whether the chart has fully initialized before calling `setState()`
3. Browser performance/rendering capabilities

## Troubleshooting

### Country Not Zooming

1. **Check if center point exists:**
   ```typescript
   console.log('Country centers:', countryCenters);
   console.log('Looking for:', countryName);
   ```

2. **Verify chart ref is available:**
   ```typescript
   console.log('Chart ref exists:', !!chartRef.current);
   ```

3. **Check console logs:** The function includes extensive logging to help debug issues.

### Zoom Level Too High/Low

Adjust the `zoomLevel` parameter:
- Decrease for more zoom (e.g., `0.1`)
- Increase for less zoom (e.g., `0.25`)

### Viewport Position Off

Adjust `offsetX` and `offsetY`:
- `offsetX > 0`: Shift viewport right
- `offsetX < 0`: Shift viewport left
- `offsetY > 0`: Shift viewport up
- `offsetY < 0`: Shift viewport down

## Advantages of This Approach

1. **Uses Center Points**: No need to manually define geographic bounds for each country
2. **Flexible Configuration**: Easy to adjust zoom level, padding, and offsets
3. **Ratio-Based**: Works consistently across different map projections
4. **Symmetric Zoom**: Ensures equal zoom on both axes for balanced framing
5. **Animated Transitions**: Smooth zoom animations improve user experience

## Summary

The auto zoom feature:
1. Extracts country center points from topology data
2. Converts geographic coordinates to ratio coordinates (0-1)
3. Applies configurable offsets to fine-tune positioning
4. Calculates symmetric zoom bounds around the center point
5. Uses AG Charts' `setState` API to apply the zoom
6. Provides smooth animated transitions

This approach is flexible, maintainable, and provides a smooth user experience when navigating the map.

