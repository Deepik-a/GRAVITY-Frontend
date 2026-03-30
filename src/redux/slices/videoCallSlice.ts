import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IncomingCallData {
  callerId: string;
  callerName: string;
  offer: RTCSessionDescriptionInit;
  receiverId: string;
  receiverType: "user" | "company";
}

interface VideoCallState {
  incomingCall: IncomingCallData | null;
  isActive: boolean;
}

const initialState: VideoCallState = {
  incomingCall: null,
  isActive: false,
};

const videoCallSlice = createSlice({
  name: "videoCall",
  initialState,
  reducers: {
    setIncomingCall: (state, action: PayloadAction<IncomingCallData>) => {
      state.incomingCall = action.payload;
    },
    clearIncomingCall: (state) => {
      state.incomingCall = null;
    },
    setCallActive: (state, action: PayloadAction<boolean>) => {
      state.isActive = action.payload;
    },
  },
});

export const { setIncomingCall, clearIncomingCall, setCallActive } = videoCallSlice.actions;
export default videoCallSlice.reducer;
