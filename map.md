Maps-Overview:

The Map Series types enable visualising geographic data in different ways.

Geographic Areas 
Index.tsx:
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-enterprise";
import { data } from "./data";
import { topology } from "./topology";
import "ag-charts-enterprise";

const ChartExample = () => {
  const [options, setOptions] = useState<AgChartOptions>({
    data,
    topology,
    series: [
      {
        type: "map-shape-background",
      },
      {
        type: "map-shape",
        title: "Access to Clean Fuels",
        idKey: "name",
        colorKey: "value",
        colorName: "% of population",
      },
    ],
    gradientLegend: {
      enabled: true,
      position: "right",
      gradient: {
        preferredLength: 200,
        thickness: 2,
      },
      scale: {
        label: {
          fontSize: 10,
          formatter: (p) => p.value + "%",
        },
      },
    },
  });

  return <AgCharts options={options as any} />;
};

const root = createRoot(document.getElementById("root")!);
root.render(<ChartExample />);

data.tsx:
export const data = [
  { name: "Albania", value: 83.7 },
  { name: "Algeria", value: 99.7 },
  { name: "Andorra", value: 100 },
  { name: "Angola", value: 50 },
  { name: "Antigua and Barbuda", value: 100 },
  { name: "Argentina", value: 99.9 },


topology.tsx:
export const topology = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [3.0871, -54.4014],
            [3.407, -54.3486],
            [3.5662, -54.3224],
            [3.5714, -54.5157],
            [3.407, -54.5279],
            [3.2236, -54.5414],
            [3.0871, -54.4014],
          ],
        ],
      },
      properties: { name: "Bouvet Island" },
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [25.2703, -17.7989],
            [26.1873, -19.5021],
            [27.6166, -20.5719],


Routes and Connections:
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-enterprise";
import { backgroundTopology } from "./backgroundTopology";
import { backgroundTopologyNI } from "./backgroundTopologyNI";
import { routeData } from "./routeData";
import { routeTopology } from "./routeTopology";
import { stationData } from "./stationData";
import { stationTopology } from "./stationTopology";
import "ag-charts-enterprise";

const ChartExample = () => {
  const [options, setOptions] = useState<AgChartOptions>({
    series: [
      {
        type: "map-shape-background",
        topology: backgroundTopologyNI,
        fill: "#badc58",
        fillOpacity: 0.4,
      },
      {
        type: "map-shape-background",
        topology: backgroundTopology,
        fill: "#badc58",
      },
      {
        type: "map-line",
        topology: routeTopology,
        data: routeData,
        idKey: "name",
        stroke: "#4834d4",
        strokeWidth: 2,
      },
      {
        type: "map-marker",
        topology: stationTopology,
        data: stationData,
        idKey: "name",
        labelKey: "name",
        fill: "#4834d4",
        fillOpacity: 1,
        strokeWidth: 0,
        size: 5,
        label: {
          color: "#535c68",
          fontSize: 8,
        },
      },
    ],
  });

  return <AgCharts options={options as any} />;
};

const root = createRoot(document.getElementById("root")!);
root.render(<ChartExample />);

Markers and Points of Interest:
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-enterprise";
import {
  africaData,
  asiaData,
  europeData,
  northAmericaData,
  oceaniaData,
  southAmericaData,
} from "./data";
import { topology } from "./topology";
import "ag-charts-enterprise";

const ChartExample = () => {
  const [options, setOptions] = useState<AgChartOptions>({
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    topology,
    series: [
      {
        type: "map-shape-background",
        topology,
      },
      {
        type: "map-marker",
        topology,
        data: [
          ...europeData,
          ...asiaData,
          ...africaData,
          ...northAmericaData,
          ...southAmericaData,
          ...oceaniaData,
        ],
        title: "Population",
        idKey: "name",
        idName: "Country",
        sizeKey: "pop_est",
        sizeName: "Population Estimate",
        topologyIdKey: "NAME_ENGL",
        size: 5,
        maxSize: 60,
        labelKey: "name",
        showInLegend: false,
      },
    ],
  });

  return <AgCharts options={options as any} />;
};

const root = createRoot(document.getElementById("root")!);
root.render(<ChartExample />);

data.tsx:
export const europeData = [
  {
    pop_est: 67059887,
    pop_rank: 16,
    gdp_md: 2715518,
    iso2: "FR",
    iso3: "FRA",
    name: "France",
  },
  {
    pop_est: 44385155,
    pop_rank: 15,
    gdp_md: 153781,
    iso2: "UA",
    iso3: "UKR",
    name: "Ukraine",
  },

React Charts Maps - Geographic Areas

 Summarise

The Map Shape Series visualises data representing geographic areas such as countries, using colours to denote distinct series or the magnitude of the values.
Simple Map Shapes 
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-enterprise";
import { central, eastern, mountain, pacific } from "./data";
import { topology } from "./topology";
import "ag-charts-enterprise";

const ChartExample = () => {
  const [options, setOptions] = useState<AgChartOptions>({
    title: {
      text: "Timezones Across America",
    },
    topology,
    series: [
      {
        type: "map-shape",
        data: pacific,
        idKey: "name",
        title: "Pacific",
      },
      {
        type: "map-shape",
        data: mountain,
        idKey: "name",
        title: "Mountain",
      },
      {
        type: "map-shape",
        data: central,
        idKey: "name",
        title: "Central",
      },
      {
        type: "map-shape",
        data: eastern,
        idKey: "name",
        title: "Eastern",
      },
    ],
    legend: {
      enabled: true,
    },
  });

  return <AgCharts options={options as any} />;
};

const root = createRoot(document.getElementById("root")!);
root.render(<ChartExample />);
To create a Map Shape Series, use the map-shape series type and provide data and topology. These can be provided in either the chart or series objects.
topology: topology,
series: [
    {
        type: 'map-shape',
        data: pacific,
        idKey: 'name',
        title: 'Pacific'
    },
    
],
legend: {
    enabled: true,
}
In this example:
•	The topology is provided once on the chart level, and the data is provided in each series.
•	idKey defines the property key in the data that will be matched against the property value in the topology. See Connecting Data to Topology for more details.
•	title provides a name for the series, and is used in the Legend and Tooltips.
Colour Scale 
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-enterprise";
import { data } from "./data";
import { topology } from "./topology";
import "ag-charts-enterprise";

const numberFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  useGrouping: true,
});

const ChartExample = () => {
  const [options, setOptions] = useState<AgChartOptions>({
    title: {
      text: "GDP by State",
    },
    data,
    topology,
    series: [
      {
        type: "map-shape",
        idKey: "name",
        colorKey: "gdp",
        tooltip: {
          renderer: ({ datum }) => ({
            data: [{ label: "GDP", value: numberFormatter.format(datum.gdp) }],
          }),
        },
      },
    ],
    gradientLegend: {
      enabled: true,
      scale: {
        label: {
          fontSize: 9,
          formatter: ({ value }) => `$${Math.floor(+value / 1e6)}T`,
        },
      },
    },
  });

  return <AgCharts options={options as any} />;
};

const root = createRoot(document.getElementById("root")!);
root.render(<ChartExample />);
To colour the shapes based on the magnitude of the data, use colorKey.
series: [
    {
        type: 'map-shape',
        idKey: 'name',
        colorKey: 'gdp',
    },
],
In this configuration:
•	colorKey is set to 'gdp', which supplies numerical values for the Colour Scale.
Labels 
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-enterprise";
import { data } from "./data";
import { topology } from "./topology";
import "ag-charts-enterprise";

const numberFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  useGrouping: true,
});

const ChartExample = () => {
  const [options, setOptions] = useState<AgChartOptions>({
    title: {
      text: "GDP by State",
    },
    data,
    topology,
    series: [
      {
        type: "map-shape",
        idKey: "name",
        labelKey: "code",
        colorKey: "gdp",
        tooltip: {
          renderer: ({ datum }) => ({
            data: [
              { label: "GDP", value: numberFormatter.format(datum.gdp) },
              { label: "Code", value: datum.code },
            ],
          }),
        },
      },
    ],
    gradientLegend: {
      enabled: true,
      scale: {
        label: {
          fontSize: 9,
          formatter: ({ value }) => `$${Math.floor(+value / 1e6)}T`,
        },
      },
    },
  });

  return <AgCharts options={options as any} />;
};

const root = createRoot(document.getElementById("root")!);
root.render(<ChartExample />);
series: [
    {
        type: 'map-shape',
        idKey: 'name',
        labelKey: 'code',
    },
],
In this configuration:
•	labelKey defines what will appear as the title for each tile.
See Label options for options for handling long labels.
Background Shapes 
The Map Shape Background Series displays all the shapes of a topology without requiring any data.
This can be useful to show disabled Map Shape Series when toggled off in the legend, or to provide context to Map Line Series and Map Marker Series.
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-enterprise";
import { central, eastern, mountain, pacific } from "./data";
import { topology } from "./topology";
import "ag-charts-enterprise";

const ChartExample = () => {
  const [options, setOptions] = useState<AgChartOptions>({
    title: {
      text: "Timezones Across America",
    },
    topology,
    series: [
      {
        type: "map-shape-background",
      },
      {
        type: "map-shape",
        data: pacific,
        idKey: "name",
        title: "Pacific",
      },
      {
        type: "map-shape",
        data: mountain,
        idKey: "name",
        title: "Mountain",
        visible: false,
      },
      {
        type: "map-shape",
        data: central,
        idKey: "name",
        title: "Central",
        visible: false,
      },
      {
        type: "map-shape",
        data: eastern,
        idKey: "name",
        title: "Eastern",
        visible: false,
      },
    ],
    legend: {
      enabled: true,
    },
  });

  return <AgCharts options={options as any} />;
};

const root = createRoot(document.getElementById("root")!);
root.render(<ChartExample />);
topology,
series: [
    {
        type: 'map-shape-background',
    },
    
],
As this is a background series rather than a data series, many normal series behaviours are disabled - including interactivity and appearing in the legend.
API Reference 
•	Map Shape 
•	Map Shape Background 
Properties available on the AgMapShapeSeriesOptions interface.
typerequired
'map-shape'
Configuration for the Map Shape Series.
topology
GeoJSON
GeoJSON data.
topologyIdKey
string
default: name
The property to reference in the topology to match up with data.
title
string
The title to use for the series.
legendItemName
string
The text to display in the legend for this series. If multiple series share this value, they will be merged for the legend toggle behaviour.
id
string
default: auto-generated value
Primary identifier for the series. This is provided as seriesId in user callbacks to differentiate multiple series. Auto-generated ids are subject to future change without warning, if your callbacks need to vary behaviour by series please supply your own unique id value.
data
TDatum[]
The data to use when rendering the series. If this is not supplied, data must be set on the chart instead.
visible
boolean
Whether to display the series.
cursor
string
The cursor to use for hovered markers. This config is identical to the CSS cursorproperty.
nodeClickRange
InteractionRange
Range from a node that a click triggers the listener.
showInLegend
boolean
Whether to include the series in the legend.
listeners
AgSeriesListeners
A map of event names to event listeners.
See child properties
idKey
string
The name of the node key containing the id value.
colorKey
string
The name of the node key containing the colour value. This value (along with colorRange config) will be used to determine the segment colour.
labelKey
string
The key to use to retrieve values from the data to use as labels inside shapes.
idName
string
A human-readable description of the id-values. If supplied, this will be shown in the default tooltip and passed to the tooltip renderer as one of the parameters.
colorName
string
A human-readable description of the colour values. If supplied, this will be shown in the default tooltip and passed to the tooltip renderer as one of the parameters.
labelName
string
A human-readable description of the label values. If supplied, this will be shown in the default tooltip and passed to the tooltip renderer as one of the parameters.
colorRange
CssColor[]
The colour range to interpolate the numeric colour domain (min and max colorKeyvalues) into.
label
AgChartAutoSizedSecondaryLabelOptions
Configuration for the labels shown inside the shape.
See child properties
padding
PixelSize
Distance between the shape edges and the text.
tooltip
AgSeriesTooltip
Series-specific tooltip configuration.
See child properties
itemStyler
Styler
A callback function for adjusting the styles of a particular Map shape based on the input parameters.
highlightStyle
AgMapShapeSeriesHighlightStyle
Style overrides when a node is hovered.
See child properties
fill
CssColor
The colour for filling shapes.
fillOpacity
Opacity
The opacity of the fill colour.
stroke
CssColor
The colour for the stroke.
strokeWidth
PixelSize
The width of the stroke in pixels.
strokeOpacity
Opacity
The opacity of the stroke colour.
lineDash
PixelSize[]
An array specifying the length in pixels of alternating dashes and gaps.
lineDashOffset
PixelSize
The initial offset of the dashed line in pixels.

React Charts Maps - Markers and Points of Interest

 Summarise

The Map Marker Series visualises data for geographic points, with the ability to vary the size to represent data values.
Simple Map Markers 
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-enterprise";
import { backgroundTopology } from "./backgroundTopology";
import { data } from "./data";
import { topology } from "./topology";
import "ag-charts-enterprise";

const ChartExample = () => {
  const [options, setOptions] = useState<AgChartOptions>({
    title: {
      text: "UK Cities",
    },
    data,
    topology,
    series: [
      {
        type: "map-shape-background",
        topology: backgroundTopology,
      },
      {
        type: "map-marker",
        idKey: "name",
      },
    ],
  });

  return <AgCharts options={options as any} />;
};

const root = createRoot(document.getElementById("root")!);
root.render(<ChartExample />);
To create a Map Marker Series, use the map-marker series type and provide data and topology. These can be provided in either the chart or series objects.
A Map Marker Series should be combined with a Map Shape Background Series.
data: data,
topology: topology,
series: [
    
    {
        type: 'map-marker',
        idKey: 'name',
    },
],
In this configuration:
•	The topology and data are provided once on the chart level.
•	idKey defines the property key in the data that will be matched against the property value in the topology. See Connecting Data to Topology for more details.
•	The map-shape-background series has its topology defined on the series level.
•	The map-shape-background series is rendered behind the map-marker series due to their order in the series array.
Map Marker Position from Data 
Instead of using a topology file, the Map Marker Series can use geographic data from within the data. This is best suited for data containing latitude and logitute coordinates such as crime data.
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-enterprise";
import { backgroundTopology } from "./backgroundTopology";
import { data } from "./data";
import "ag-charts-enterprise";

const ChartExample = () => {
  const [options, setOptions] = useState<AgChartOptions>({
    title: {
      text: "Crime in Surrey",
    },
    data,
    series: [
      {
        type: "map-shape-background",
        topology: backgroundTopology,
      },
      {
        type: "map-marker",
        latitudeKey: "lat",
        longitudeKey: "lon",
      },
    ],
  });

  return <AgCharts options={options as any} />;
};

const root = createRoot(document.getElementById("root")!);
root.render(<ChartExample />);
data: data,
series: [
    
    {
        type: 'map-marker',
        latitudeKey: 'lat',
        longitudeKey: 'lon',
    },
],
In this configuration:
•	No topology is required for the map-marker series.
•	latitudeKey and longitudeKey refer to fields in the provided data, and are used to position the marker.
Proportional Marker Size 
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-enterprise";
import { backgroundTopology } from "./backgroundTopology";
import { data } from "./data";
import "ag-charts-enterprise";

const ChartExample = () => {
  const [options, setOptions] = useState<AgChartOptions>({
    title: {
      text: "Crime in Surrey",
    },
    data,
    series: [
      {
        type: "map-shape-background",
        topology: backgroundTopology,
      },
      {
        type: "map-marker",
        latitudeKey: "lat",
        longitudeKey: "lon",
        sizeKey: "count",
        sizeName: "Count",
        size: 3,
        maxSize: 50,
      },
    ],
  });

  return <AgCharts options={options as any} />;
};

const root = createRoot(document.getElementById("root")!);
root.render(<ChartExample />);
To vary the size of the marker to denote the magnitude of the data values use sizeKey, size and maxSize.
series: [
    
    {
        type: 'map-marker',
        latitudeKey: 'lat',
        longitudeKey: 'lon',
        sizeKey: 'count',
        sizeName: 'Count',
        size: 3,
        maxSize: 50,
    },
],
In this configuration:
•	sizeKey provides the numerical values determining the size of each marker.
•	sizeName is optional and configures the display name reflected in Tooltips.
•	size provides the size of the marker for the smallest data point.
•	maxSize provides the size for the largest data point.
Customisation 
It is possible to customise the fill, stroke and shape of the markers, as well as to add labels. See the API Reference for more details.
API Reference 
•	
Properties available on the AgMapMarkerSeriesOptions interface.
Configuration for the Map Marker Series.
The property to reference in the topology to match up with data.
The title to use for the series.
The text to display in the legend for this series. If multiple series share this value, they will be merged for the legend toggle behaviour.
Primary identifier for the series. This is provided as seriesId in user callbacks to differentiate multiple series. Auto-generated ids are subject to future change without warning, if your callbacks need to vary behaviour by series please supply your own unique id value.
The data to use when rendering the series. If this is not supplied, data must be set on the chart instead.
Whether to display the series.
The cursor to use for hovered markers. This config is identical to the CSS cursor property.
Range from a node that a click triggers the listener.
Whether to include the series in the legend.
A map of event names to event listeners.
The name of the node key containing the id value.
The key to use to retrieve latitude values from the data, used to control the position of the markers.
The key to use to retrieve longitude values from the data, used to control the position of the markers.
The key to use to retrieve size values from the data, used to control the size of the markers.
The name of the node key containing the colour value. This value (along with colorRange config) will be used to determine the colour of the markers.
The key to use to retrieve values from the data to use as labels for the markers.
A human-readable description of the id-values. If supplied, this will be shown in the default tooltip and passed to the tooltip renderer as one of the parameters.
A human-readable description of the latitude values. If supplied, this will be shown in the default tooltip and passed to the tooltip renderer as one of the parameters.
A human-readable description of the longitude values. If supplied, this will be shown in the default tooltip and passed to the tooltip renderer as one of the parameters.
A human-readable description of the size values. If supplied, this will be shown in the default tooltip and passed to the tooltip renderer as one of the parameters.
A human-readable description of the colour values. If supplied, this will be shown in the default tooltip and passed to the tooltip renderer as one of the parameters.
A human-readable description of the label values. If supplied, this will be shown in the default tooltip and passed to the tooltip renderer as one of the parameters.
Determines the largest size a marker can be in pixels.
Explicitly specifies the extent of the domain for series sizeKey.
The colour range to interpolate the numeric colour domain (min and max colorKey values) into.
Configuration for the labels shown on top of data points.
Series-specific tooltip configuration.
A callback function for adjusting the styles of a particular Map marker based on the input parameters.
Style overrides when a node is hovered.
The shape to use for the markers. You can also supply a custom marker by providing a AgMarkerShapeFn function.
The size in pixels of the markers.
The colour for filling shapes.
The opacity of the fill colour.
The colour for the stroke.
The width of the stroke in pixels.
The opacity of the stroke colour.
An array specifying the length in pixels of alternating dashes and gaps.
The initial offset of the dashed line in pixels.
React Charts Maps - Topology

 Summarise

All AG Charts Map Series use the GeoJSON format for their topology data.
GeoJSON is an industry-standard specification for representing geographic shapes, lines, and points.
AG Charts does not provide any topology files. It is up to the user to source and license these files, which are widely available online.
GeoJSON Features 
A GeoJSON file contains a list of features. Each feature contains a description of geographic data (geometry) along with associated properties.
Geometry types 
There are seven geometry types used, as listed in the table below.
Geometry Type	Usage	Series to Use
Polygon, MultiPolygon	Geographic areas - the border of the United Kingdom and all its islands.	Map Shape Series or Map Marker Series

LineString, MultiLineString	Routes and connections - flight paths, roads, or rivers.	Map Line Series

Point, MultiPoint	Markers and points of interest - city centres, building locations.	Map Marker Series

GeometryCollection	A collection of one or more feature types. Uncommon to encounter.	Choose the series type for the feature types you wish to render.
Properties 
The properties of a feature are represented as a JSON object. While there is no standard for which properties are included, they typically contain the name of the feature in the property called name.
"properties": {
    "name": "United Kingdom",
    "code": "GB"
}
Connecting Data to Topology 
When using a Map Series which requires topology, both the topology and the data must be provided in the chart or series options.
series: [
    {
        type: 'map-shape',
        topology: {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [...],
                    },
                    properties: {
                        name: 'United Kingdom',
                        code: 'GB'
                    }
                }
            ],
            
        },
        data: [
            { country: 'United Kingdom', population: 67330000 },
            { country: 'France', population: 67500000 },
            
        ],
        idKey: 'country',
        topologyIdKey: 'name' 
    }
]
•	Each item in the data must contain a field that refers to the associated geometry for that data item. In the above example this is the countryfield.
•	The series definition must contain an idKey which refers to this field.
•	The series definition can contain an optional topologyIdKey to match to the relevant field in the GeoJSON properties. If not provided, this will default to name.
•	In this example, the first data item which has the value of United Kingdom will match to the topology feature with the matching properties.name value.
Data items should always have a matching topology feature, and will log a warning to the console if they don't. Topology features that don't correspond to a data item are not rendered, and are ignored without a warning.
Topology for Background Series 
The Map Shape Background and Map Line Background series do not use any data. These series will render every relevant feature found in the provided topology.
