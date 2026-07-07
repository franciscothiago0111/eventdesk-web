export interface CheckIn {
  id: string;
  registrationId: string;
  checkedInById: string;
  checkedInAt: string;
  fromOfflineSync: boolean;
}

// Payload emitted by the `checkin.recorded` socket event — a subset of
// `CheckIn` (the gateway doesn't send `checkedInAt`, so the client stamps
// its own receipt time for display purposes).
export interface CheckInRecordedEvent {
  checkInId: string;
  registrationId: string;
  checkedInById: string;
  fromOfflineSync: boolean;
}
