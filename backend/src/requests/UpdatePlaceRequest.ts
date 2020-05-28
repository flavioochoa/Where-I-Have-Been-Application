/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdatePlaceRequest {
  markerName: string,
  markerText: string,
  lat: string
  lng: string
  images?: string
}