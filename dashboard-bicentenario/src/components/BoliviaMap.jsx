import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HC_map from "highcharts/modules/map";
import "../css/boliviaMap.css";
import mapDataBolivia from "@highcharts/map-collection/countries/bo/bo-all.geo.json";

// Inicializar el módulo de mapas
if (typeof HC_map === "function") {
  HC_map(Highcharts);
}

const BoliviaMap = ({
  data = {},
  title = "Distribución por Departamento",
  colorRange = ["#e3f2fd", "#1565c0"], // de azul claro a azul oscuro
  width = 600,
  height = 500,
  className = "",
}) => {
  // Transformar data en formato que Highcharts entiende
  const mapData = mapDataBolivia.features.map((feature) => {
    const name = feature.properties.name; // Nombre del depto
    return {
      "hc-key": feature.properties["hc-key"], // clave única de cada depto
      name,
      value: data[name] || 0,
    };
  });

  const options = {
    chart: {
      map: mapDataBolivia,
      height,
      width,
      backgroundColor: "#D9CBBF", // Establecer el color de fondo del mapa
    },
    title: {
      text: title,
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: "bottom",
      },
    },
    colorAxis: {
      min: 0,
      minColor: colorRange[0],
      maxColor: colorRange[1],
    },
    series: [
      {
        data: mapData,
        mapData: mapDataBolivia,
        joinBy: "hc-key", // Unir por hc-key (clave del GeoJSON)
        name: "Cantidad",
        states: {
          hover: {
            color: "#FF5733", // Color al pasar el mouse
          },
        },
        dataLabels: {
          enabled: true,
          format: "{point.name}", // Mostrar nombre del depto
        },
        tooltip: {
          pointFormat: "{point.name}: <b>{point.value}</b>",
        },
      },
    ],
  };

  return (
    <div className={`bolivia-map ${className}`} style={{ width, height }}>
      <HighchartsReact
        constructorType="mapChart"
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
};

// 🔹 Datos de ejemplo
export const sampleBoliviaData = {
  "La Paz": 90,
  "Santa Cruz": 75,
  "Cochabamba": 60,
  "Potosí": 45,
  "Chuquisaca": 90,
  "Oruro": 25,
  "Tarija": 20,
  "Beni": 15,
  "Pando": 5,
};

export default BoliviaMap;
