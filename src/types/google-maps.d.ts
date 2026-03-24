declare namespace google {
  namespace maps {
    interface MapOptions {
      center: { lat: number; lng: number };
      zoom: number;
      mapTypeId: string;
    }

    interface Map {
      constructor(element: HTMLElement, options: MapOptions): Map;
    }

    interface Marker {
      constructor(options: {
        position: { lat: number; lng: number };
        map: Map;
        draggable: boolean;
      }): Marker;

      getPosition(): { lat(): number; lng(): number };
      setMap(map: Map | null): void;
    }

    namespace event {
      function addListener(marker: Marker, eventName: string, callback: () => void): void;
    }
  }
}
