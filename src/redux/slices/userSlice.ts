import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string;
  profileImage: string;
}

const initialState: UserState = {
  name: '',
  profileImage: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<{ name: string; profileImage?: string }>) => {
      state.name = action.payload.name;
      state.profileImage = action.payload.profileImage || '';
    },
    clearUserProfile: (state) => {
      state.name = '';
      state.profileImage = '';
    },
    updateName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    updateProfileImage: (state, action: PayloadAction<string>) => {
      state.profileImage = action.payload;
    },
  },
});

export const { setUserProfile, clearUserProfile, updateName, updateProfileImage } = userSlice.actions;
export default userSlice.reducer;
