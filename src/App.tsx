import { AgCharts } from 'ag-charts-react'
import { useMemo, useRef, useState } from 'react'
import type { AgChartOptions } from 'ag-charts-enterprise'
import 'ag-charts-enterprise'
import { globeData } from './assets/globeData'
import { mockData } from './assets/mockData'
import './App.css'

function App() {
  const chartRef = useRef<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  
  // ===== ZOOM CONFIGURATION - Easy to tweak =====
  const zoomConfig = {
    zoomLevel: 0.15,        // Zoom amount: smaller = more zoomed in (0.1 = very zoomed, 0.3 = less zoomed)
    padding: 0.1,           // Padding around the zoomed area (0.1 = 10% padding)
    offsetX: 0,             // Horizontal offset: positive = shift right, negative = shift left (in ratio units, e.g., 0.05 = 5%)
    offsetY: -0.20,          // Vertical offset: positive = shift up, negative = shift down (in ratio units, e.g., 0.05 = 5%)
  };
  // ===============================================
  
  // Extract country center points from globeData
  const countryCenters = useMemo(() => {
    const centers: Record<string, { lng: number; lat: number }> = {};
    try {
      const features = (globeData as any)?.features ?? [];
      for (const feature of features) {
        const name = feature?.properties?.name;
        const labelX = feature?.properties?.label_x;
        const labelY = feature?.properties?.label_y;
        
        if (typeof name === 'string' && name.length > 0 && 
            typeof labelX === 'number' && typeof labelY === 'number') {
          centers[name] = { lng: labelX, lat: labelY };
        }
      }
    } catch (error) {
      console.error('Error extracting country centers:', error);
    }
    return centers;
  }, []);

  const countries = useMemo(() => {
    const list = new Set<string>();
    try {
      const features = (globeData as any)?.features ?? [];
      for (const f of features) {
        const name = f?.properties?.name;
        if (typeof name === 'string' && name.length > 0) list.add(name);
      }
    } catch {}
    return Array.from(list).sort((a, b) => a.localeCompare(b));
  }, []);

  // Create data for all countries so they can be highlighted even without mockData
  const allCountriesData = useMemo(() => {
    return countries.map(name => ({ name }));
  }, [countries]);

  const options: AgChartOptions = useMemo(() => ({
    title: { text: 'World Map' },
    topology: globeData,
    data: mockData,
    series: [
      { type: 'map-shape-background' },
      {
        type: 'map-shape',
        title: 'Mock Metric',
        idKey: 'name',
        topologyIdKey: 'name',
        colorKey: 'value',
        colorName: 'Value',
      },
      {
        id: 'countryHighlight',
        type: 'map-shape',
        idKey: 'name',
        topologyIdKey: 'name',
        data: allCountriesData,
        showInLegend: false,
        fill: 'transparent',
        fillOpacity: 0,
        stroke: 'transparent',
        strokeWidth: 0,
        itemStyler: (params: any) => {
          // Highlight the selected country with a blue outline
          if (selectedCountry && params.datum?.name === selectedCountry) {
            return {
              stroke: '#0066FF',
              strokeWidth: 2,
              strokeOpacity: 1,
            };
          }
          // Return transparent for non-selected countries so they don't interfere
          return {
            stroke: 'transparent',
            strokeWidth: 0,
            fill: 'transparent',
            fillOpacity: 0,
          };
        },
      },
    ],
    gradientLegend: {
      enabled: false,
    },
    zoom: {
      enabled: true,
      axes: 'xy',
      enablePanning: true,
      enableScrolling: true,
      enableDoubleClickToReset: true,
      buttons: { enabled: true, visible: 'always' },
    },
    animation: {
      enabled: true,
      duration: 1000
    }
  }), [selectedCountry, allCountriesData]);

  const zoomToCountry = async (countryName: string) => {
    console.log('🔍 zoomToCountry called:', { countryName, chartRefExists: !!chartRef.current });
    
    if (!chartRef.current || !countryName) {
      console.warn('❌ Early return:', { chartRefExists: !!chartRef.current, countryName });
      return;
    }

    console.log('📊 Chart instance:', chartRef.current);
    console.log('🔑 Available methods:', Object.keys(chartRef.current));

    // Get center point from globeData
    const center = countryCenters[countryName];
    console.log('🗺️ Country center lookup:', { countryName, center, availableCountries: Object.keys(countryCenters).slice(0, 10) });
    
    if (!center) {
      console.warn(`No center point found for country: ${countryName}`);
      return;
    }

    try {
      // Convert center point to ratios first to ensure it's truly centered
      const WORLD_LNG_MIN = -180;
      const WORLD_LNG_MAX = 180;
      const WORLD_LNG_RANGE = WORLD_LNG_MAX - WORLD_LNG_MIN; // 360
      
      const WORLD_LAT_MIN = -90;
      const WORLD_LAT_MAX = 90;
      const WORLD_LAT_RANGE = WORLD_LAT_MAX - WORLD_LAT_MIN; // 180
      
      let centerRatioX = (center.lng - WORLD_LNG_MIN) / WORLD_LNG_RANGE;
      let centerRatioY = (center.lat - WORLD_LAT_MIN) / WORLD_LAT_RANGE;
      
      // Apply offset to center point
      centerRatioX += zoomConfig.offsetX;
      centerRatioY += zoomConfig.offsetY;
      
      // Clamp to valid range [0, 1]
      centerRatioX = Math.max(0, Math.min(1, centerRatioX));
      centerRatioY = Math.max(0, Math.min(1, centerRatioY));
      
      console.log('📍 Center point (absolute):', center);
      console.log('📍 Center point (ratios, before offset):', { 
        ratioX: (center.lng - WORLD_LNG_MIN) / WORLD_LNG_RANGE, 
        ratioY: (center.lat - WORLD_LAT_MIN) / WORLD_LAT_RANGE 
      });
      console.log('📍 Center point (ratios, after offset):', { ratioX: centerRatioX, ratioY: centerRatioY });
      console.log('⚙️ Using config:', zoomConfig);
      
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
      
      console.log('📊 Calculated ratios (centered with offset):', ratios);
      
      // Get current state to use the correct version
      const currentState = chartRef.current.getState?.();
      const version = currentState?.version || '12.3.1';
      
      const stateToSet = {
        version: version,
        zoom: {
          ratioX: ratios.ratioX,
          ratioY: ratios.ratioY
        }
      };
      console.log('🎯 Setting state:', stateToSet);
      
      const result = await chartRef.current.setState(stateToSet);
      console.log('✅ setState result:', result);
      
      // Check current state after setting
      const updatedState = chartRef.current.getState?.();
      console.log('📋 Current chart state after set:', updatedState);
    } catch (error) {
      console.error('❌ Error zooming to country:', error);
    }
  };

  const resetZoom = async () => {
    console.log('🔄 resetZoom called:', { chartRefExists: !!chartRef.current });
    if (!chartRef.current) {
      console.warn('❌ Chart ref not available for reset');
      return;
    }
    
    try {
      // Get current state to use the correct version
      const currentState = chartRef.current.getState?.();
      const version = currentState?.version || '12.3.1';
      
      // Reset to world view (ratios 0 to 1)
      const resetState = {
        version: version,
        zoom: {
          ratioX: { start: 0, end: 1 },
          ratioY: { start: 0, end: 1 }
        }
      };
      console.log('🌍 Resetting zoom to world view:', resetState);
      const result = await chartRef.current.setState(resetState);
      console.log('✅ Reset zoom result:', result);
    } catch (error) {
      console.error('❌ Error resetting zoom:', error);
    }
  };

  const handleCountryChange = async (value: string) => {
    console.log('🎯 handleCountryChange called:', { value, chartRefExists: !!chartRef.current });
    setSelectedCountry(value);
    
    if (!chartRef.current) {
      console.warn('❌ Chart ref not available');
      return;
    }
    
    try {
      // The highlight will be applied automatically via itemStyler in options
      // which updates when selectedCountry changes
      console.log('📍 Selected country:', value);

      // Zoom to country if center point is available
      console.log('🔍 Checking center point for zoom:', { value, hasCenter: value ? !!countryCenters[value] : false });
      if (value && countryCenters[value]) {
        console.log('🚀 Calling zoomToCountry...');
        await zoomToCountry(value);
      } else {
        console.warn('⚠️ No center point available for country:', value);
      }
    } catch (e) {
      console.error('❌ Failed to update selection overlay or zoom', e);
    }
  };

  const handleUKShortcut = async () => {
    console.log('🇬🇧 UK shortcut button clicked');
    const ukCountryName = 'United Kingdom';
    console.log('🔍 Looking for country:', ukCountryName);
    console.log('📋 Available countries (first 10):', Object.keys(countryCenters).slice(0, 10));
    console.log('✅ UK center exists:', !!countryCenters[ukCountryName]);
    console.log('📊 Chart ref exists:', !!chartRef.current);
    
    // handleCountryChange will update both the dropdown and zoom to the country
    await handleCountryChange(ukCountryName);
  };

  return (
    <div className="app-container">
      <h1>React + AG Charts</h1>
      <div className="chart-container">
        <AgCharts 
          ref={chartRef}
          options={options} 
          style={{ width: '100%', height: '100%' }} 
        />
      </div>
      <div style={{ marginTop: 16, width: '100%', maxWidth: 900, textAlign: 'left', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <label htmlFor="country-select" style={{ marginRight: 8 }}>Country:</label>
        <select
          id="country-select"
          value={selectedCountry}
          onChange={(e) => handleCountryChange(e.target.value)}
          style={{ padding: 6, minWidth: 260 }}
        >
          <option value="">Select a country…</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button 
          onClick={(e) => {
            e.preventDefault();
            handleUKShortcut();
          }} 
          style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
          title="Zoom to United Kingdom"
        >
          🇬🇧 UK
        </button>
        <button 
          onClick={resetZoom} 
          style={{ padding: '8px 16px', cursor: 'pointer' }}
          disabled={!chartRef.current}
        >
          Reset Zoom
        </button>
      </div>
    </div>
  )
}

export default App
