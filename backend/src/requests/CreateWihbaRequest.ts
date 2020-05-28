/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateWihbaRequest {
  markerName: string
  markerText: string
  lat: string
  lng: string
  creationDate: string
}
