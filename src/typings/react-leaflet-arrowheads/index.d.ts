declare module 'react-leaflet-arrowheads' {
    import { PolylineProps } from 'react-leaflet';
    import { PathOptions } from 'leaflet';

    interface Arrowheads extends PathOptions {
        yawn?: number;
        size?: string | number;
        frequency?: string | number;
        proportionalToTotal?: boolean;
    }

    const ArrowheadsPolyline: React.FC<PolylineProps & { arrowheads: Arrowheads }>;

    export default ArrowheadsPolyline;
}
