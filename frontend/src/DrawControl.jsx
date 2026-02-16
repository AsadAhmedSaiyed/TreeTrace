import { useEffect } from "react";
import { useMap } from "react-leaflet";

function DrawControl({ onRectangleDrawn }) {
  const map = useMap();

  useEffect(() => {
    // 1. Add Controls (Standard Mode)
    map.pm.addControls({
      position: "topleft",
      drawMarker: false,
      drawPolygon: false,
      drawPolyline: false,
      drawCircle: false,
      drawCircleMarker: false,
      drawText: false,
      drawRectangle: true, // Always true
      cutPolygon: false,
      editMode: false,
      dragMode: false, 
      rotateMode: false,
      removalMode: true,
    });

    // 2. Handle Creation (Auto-delete old shape)
    const handleCreate = (e) => {
      if (e.shape === "Rectangle") {
        // Remove ALL other Geoman layers (Keep only the new one)
        const layers = map.pm.getGeomanLayers();
        layers.forEach((layer) => {
          if (layer._leaflet_id !== e.layer._leaflet_id) {
            layer.remove();
          }
        });

        // Send new bounds to parent
        onRectangleDrawn(e.layer.getBounds());
      }
    };

    // 3. Handle Removal
    const handleRemove = (e) => {
      // If the user manually deletes the shape, clear the state
      if (map.pm.getGeomanLayers().length === 0) {
        onRectangleDrawn(null);
      }
    };

    map.on("pm:create", handleCreate);
    map.on("pm:remove", handleRemove);

    return () => {
      map.pm.removeControls();
      map.off("pm:create", handleCreate);
      map.off("pm:remove", handleRemove);
    };
  }, [map, onRectangleDrawn]);

  return null;
}

export default DrawControl;