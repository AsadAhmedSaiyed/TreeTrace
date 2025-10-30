import { useEffect } from "react";
import { useMap } from "react-leaflet";


function DrawControl({ onRectangleDrawn }) {
  const map = useMap();
  useEffect(() => {
    map.pm.removeControls();
    map.pm.addControls({
      position: "topleft",
      drawMarker: false,
      drawPolygon: false,
      drawPolyline: false,
      drawCircle: false,
      drawCircleMarker: false,
      drawText: false,
      drawRectangle: true,
      cutPolygon: false,
      editMode: false,
      dragMode: true,
      rotateMode: false,
      removalMode: true,
    });
    map.on("pm:create", (e) => {
      if (e.shape === "Rectangle") {
        const bounds = e.layer.getBounds();
        onRectangleDrawn(bounds);
      }
    });

    return () => {
      map.pm.removeControls();
      map.off("pm:create");
    };
  }, [map, onRectangleDrawn]);
  return null;
}

export default DrawControl;
