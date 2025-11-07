# Auto-Zooming to Countries in AG Charts Maps

This guide explains how to programmatically zoom into specific countries on an AG Charts map when users select them from a dropdown menu.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Implementation Steps](#implementation-steps)
- [Complete Example](#complete-example)
- [Finding Country Bounds](#finding-country-bounds)
- [Advanced Options](#advanced-options)
- [Troubleshooting](#troubleshooting)

## Overview

AG Charts provides a Chart State API that allows you to programmatically control the zoom state of a map. By defining geographic bounds (latitude/longitude ranges) for each country, you can zoom to specific regions when users interact with your application.

### Key Concepts

- **Chart State API**: Methods `getState()` and `setState()` for managing chart state
- **Zoom State**: Defined by `rangeX` (longitude) and `rangeY` (latitude) or by ratios
- **Geographic Bounds**: Minimum and maximum latitude/longitude for each country

## Prerequisites

- AG Charts Enterprise or AG Charts Community (with map support)
- React (for this example, but vanilla JS works similarly)
- Basic understanding of latitude/longitude coordinates

## Implementation Steps

### Step 1: Enable Zoom on Your Map

First, ensure your map chart has zoom enabled:

```javascript
const chartOptions = {
  topology: yourTopologyData,
  series: [{
    type: 'map-shape',
    // your series configuration
  }],
  zoom: {
    enabled: true,
    axes: 'xy',  // Enable zoom on both axes
    enablePanning: true,
    enableScrolling: true
  }
};
```

### Step 2: Store Chart Reference

You need to capture a reference to the chart instance to call `setState()` later:

```jsx
import { AgCharts } from 'ag-charts-react';
import { useState } from 'react';

function MapComponent() {
  const [chartInstance, setChartInstance] = useState(null);

  return (
    <AgCharts 
      options={chartOptions}
      onChartReady={(chart) => setChartInstance(chart)}
    />
  );
}
```

### Step 3: Define Country Bounds

Create a data structure containing the geographic bounds for each country:

```javascript
const countryBounds = {
  'USA': {
    rangeX: { start: -125, end: -66 },   // Longitude: West to East
    rangeY: { start: 24, end: 49 }       // Latitude: South to North
  },
  'Canada': {
    rangeX: { start: -141, end: -52 },
    rangeY: { start: 42, end: 83 }
  },
  'UK': {
    rangeX: { start: -8, end: 2 },
    rangeY: { start: 49.5, end: 59 }
  },
  'Germany': {
    rangeX: { start: 5.9, end: 15.0 },
    rangeY: { start: 47.3, end: 55.1 }
  },
  'France': {
    rangeX: { start: -5, end: 9.6 },
    rangeY: { start: 41.3, end: 51.1 }
  },
  'Japan': {
    rangeX: { start: 129, end: 146 },
    rangeY: { start: 30, end: 46 }
  },
  'Australia': {
    rangeX: { start: 113, end: 154 },
    rangeY: { start: -44, end: -10 }
  },
  'Brazil': {
    rangeX: { start: -74, end: -34 },
    rangeY: { start: -34, end: 5 }
  },
  'India': {
    rangeX: { start: 68, end: 97 },
    rangeY: { start: 8, end: 35 }
  },
  'China': {
    rangeX: { start: 73, end: 135 },
    rangeY: { start: 18, end: 54 }
  }
};
```

### Step 4: Create Zoom Function

Implement a function that uses the Chart State API to zoom to a country:

```javascript
const zoomToCountry = async (countryCode) => {
  if (!chartInstance) {
    console.warn('Chart instance not ready');
    return;
  }

  const bounds = countryBounds[countryCode];
  
  if (!bounds) {
    console.warn(`No bounds defined for country: ${countryCode}`);
    return;
  }

  try {
    await chartInstance.setState({
      version: '1.0.0',
      zoom: {
        rangeX: bounds.rangeX,
        rangeY: bounds.rangeY
      }
    });
  } catch (error) {
    console.error('Error zooming to country:', error);
  }
};
```

### Step 5: Connect to Dropdown

Create a dropdown menu and connect it to your zoom function:

```jsx
<select 
  onChange={(e) => zoomToCountry(e.target.value)}
  defaultValue=""
>
  <option value="" disabled>Select a country to zoom</option>
  <option value="USA">United States</option>
  <option value="Canada">Canada</option>
  <option value="UK">United Kingdom</option>
  <option value="Germany">Germany</option>
  <option value="France">France</option>
  <option value="Japan">Japan</option>
  <option value="Australia">Australia</option>
  <option value="Brazil">Brazil</option>
  <option value="India">India</option>
  <option value="China">China</option>
</select>
```

## Complete Example

Here's a full React component implementation:

```jsx
import React, { useState } from 'react';
import { AgCharts } from 'ag-charts-react';

const countryBounds = {
  'USA': {
    rangeX: { start: -125, end: -66 },
    rangeY: { start: 24, end: 49 }
  },
  'UK': {
    rangeX: { start: -8, end: 2 },
    rangeY: { start: 49.5, end: 59 }
  },
  'Japan': {
    rangeX: { start: 129, end: 146 },
    rangeY: { start: 30, end: 46 }
  },
  'Australia': {
    rangeX: { start: 113, end: 154 },
    rangeY: { start: -44, end: -10 }
  }
};

function WorldMapWithZoom() {
  const [chartInstance, setChartInstance] = useState(null);

  const chartOptions = {
    topology: fetch('https://your-topology-url.json').then(r => r.json()),
    series: [
      {
        type: 'map-shape',
        data: yourMapData,
        idKey: 'countryCode',
        title: 'Countries',
        fill: '#6495ED',
        stroke: '#fff',
        strokeWidth: 1
      }
    ],
    zoom: {
      enabled: true,
      axes: 'xy',
      enablePanning: true,
      enableScrolling: true,
      enableDoubleClickToReset: true,
      scrollingStep: 0.2
    }
  };

  const zoomToCountry = async (countryCode) => {
    if (!chartInstance || !countryCode) return;

    const bounds = countryBounds[countryCode];
    if (!bounds) return;

    await chartInstance.setState({
      version: '1.0.0',
      zoom: {
        rangeX: bounds.rangeX,
        rangeY: bounds.rangeY
      }
    });
  };

  const resetZoom = async () => {
    if (!chartInstance) return;
    
    // Reset to world view
    await chartInstance.setState({
      version: '1.0.0',
      zoom: {
        rangeX: { start: -180, end: 180 },
        rangeY: { start: -90, end: 90 }
      }
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <select 
          onChange={(e) => zoomToCountry(e.target.value)}
          defaultValue=""
          style={{ marginRight: '10px', padding: '8px' }}
        >
          <option value="" disabled>Select a country</option>
          <option value="USA">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="Japan">Japan</option>
          <option value="Australia">Australia</option>
        </select>
        
        <button onClick={resetZoom} style={{ padding: '8px' }}>
          Reset Zoom
        </button>
      </div>

      <AgCharts 
        options={chartOptions}
        onChartReady={(chart) => setChartInstance(chart)}
      />
    </div>
  );
}

export default WorldMapWithZoom;
```

## Finding Country Bounds

### Method 1: Use Predefined Data

Several libraries and datasets provide country bounding boxes:

```javascript
// Example using a geographic data library
import { countryBoundingBoxes } from 'country-bounding-boxes';

const bounds = countryBoundingBoxes.get('USA');
// Returns: { minLng: -125, maxLng: -66, minLat: 24, maxLat: 49 }
```

### Method 2: Calculate from Your Topology Data

```javascript
function calculateBounds(countryFeature) {
  let minLng = Infinity, maxLng = -Infinity;
  let minLat = Infinity, maxLat = -Infinity;

  // Assuming GeoJSON format
  const coordinates = countryFeature.geometry.coordinates;
  
  // Flatten coordinates and find bounds
  function processCoords(coords) {
    if (typeof coords[0] === 'number') {
      // It's a coordinate pair [lng, lat]
      minLng = Math.min(minLng, coords[0]);
      maxLng = Math.max(maxLng, coords[0]);
      minLat = Math.min(minLat, coords[1]);
      maxLat = Math.max(maxLat, coords[1]);
    } else {
      // It's an array of coordinates
      coords.forEach(processCoords);
    }
  }
  
  processCoords(coordinates);
  
  return {
    rangeX: { start: minLng, end: maxLng },
    rangeY: { start: minLat, end: maxLat }
  };
}
```

### Method 3: Manual Definition

For common countries, you can manually define bounds:

| Country | Longitude Range | Latitude Range |
|---------|----------------|----------------|
| USA | -125 to -66 | 24 to 49 |
| Canada | -141 to -52 | 42 to 83 |
| UK | -8 to 2 | 49.5 to 59 |
| France | -5 to 9.6 | 41.3 to 51.1 |
| Germany | 5.9 to 15.0 | 47.3 to 55.1 |
| Spain | -9.3 to 4.3 | 36 to 43.8 |
| Italy | 6.6 to 18.5 | 36.6 to 47.1 |
| Japan | 129 to 146 | 30 to 46 |
| China | 73 to 135 | 18 to 54 |
| India | 68 to 97 | 8 to 35 |
| Australia | 113 to 154 | -44 to -10 |
| Brazil | -74 to -34 | -34 to 5 |

## Advanced Options

### Adding Padding

Add padding around the country bounds for better visualization:

```javascript
function addPadding(bounds, paddingPercent = 0.1) {
  const lngRange = bounds.rangeX.end - bounds.rangeX.start;
  const latRange = bounds.rangeY.end - bounds.rangeY.start;
  
  return {
    rangeX: {
      start: bounds.rangeX.start - (lngRange * paddingPercent),
      end: bounds.rangeX.end + (lngRange * paddingPercent)
    },
    rangeY: {
      start: bounds.rangeY.start - (latRange * paddingPercent),
      end: bounds.rangeY.end + (latRange * paddingPercent)
    }
  };
}
```

### Using Ratio Instead of Range

Alternatively, you can use ratios (0 to 1) instead of absolute coordinates:

```javascript
await chartInstance.setState({
  version: '1.0.0',
  zoom: {
    ratioX: { start: 0.3, end: 0.7 },  // 30% to 70% of width
    ratioY: { start: 0.2, end: 0.6 }   // 20% to 60% of height
  }
});
```

### Smooth Animation

The zoom transition is automatically animated. You can adjust animation speed through chart options:

```javascript
const chartOptions = {
  // ... other options
  animation: {
    enabled: true,
    duration: 1000  // milliseconds
  }
};
```

### Combining with Initial State

Set an initial zoom when the chart loads:

```javascript
const chartOptions = {
  initialState: {
    zoom: {
      rangeX: { start: -125, end: -66 },
      rangeY: { start: 24, end: 49 }
    }
  },
  // ... other options
};
```

## Troubleshooting

### Chart Instance is Null

**Problem**: `chartInstance` is null when trying to zoom.

**Solution**: Ensure you're using `onChartReady` callback and waiting for the chart to initialize:

```jsx
const [isChartReady, setIsChartReady] = useState(false);

<AgCharts 
  options={chartOptions}
  onChartReady={(chart) => {
    setChartInstance(chart);
    setIsChartReady(true);
  }}
/>

// Only enable dropdown when chart is ready
<select disabled={!isChartReady} onChange={...}>
```

### Zoom Not Working

**Problem**: Calling `setState()` doesn't zoom the map.

**Solution**: 
1. Verify zoom is enabled in chart options
2. Check that bounds are in correct format (longitude = X, latitude = Y)
3. Ensure coordinates are within valid ranges (lng: -180 to 180, lat: -90 to 90)

### Wrong Region Displayed

**Problem**: Zooms to incorrect location.

**Solution**: 
- Verify longitude/latitude order (longitude is X, latitude is Y)
- Check if your topology uses a different coordinate system
- Use negative values for West longitude and South latitude

### Zoom Too Close or Too Far

**Problem**: The zoom level is not appropriate for the country size.

**Solution**: Adjust the bounds or add padding:

```javascript
// Add more padding for smaller countries
const adjustedBounds = addPadding(countryBounds['UK'], 0.2);

// Or manually adjust the bounds
const countryBounds = {
  'UK': {
    rangeX: { start: -10, end: 4 },   // Wider range
    rangeY: { start: 48, end: 60 }     // Wider range
  }
};
```

## Additional Resources

- [AG Charts Zoom Documentation](https://charts.ag-grid.com/react/zoom/)
- [AG Charts State API Documentation](https://charts.ag-grid.com/react/state/)
- [AG Charts Map Series Documentation](https://charts.ag-grid.com/react/map-series/)
- [GeoJSON Format Specification](https://geojson.org/)

## Summary

By leveraging AG Charts' Chart State API, you can create an interactive map experience where users can easily navigate to specific countries through a dropdown menu. The key steps are:

1. Enable zoom on your map
2. Capture the chart instance reference
3. Define geographic bounds for each country
4. Use `setState()` to programmatically zoom
5. Connect to UI elements like dropdowns or buttons

This approach provides smooth, animated transitions and a professional user experience for geographic data visualization.
