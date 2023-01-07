import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../struct/user'
import { getUserInfo } from './userActionCreators'

export interface UserState {
  value: number
  user: User
  logged: boolean
}

const initialState: UserState = {
  value: 0,
  user: {
    id: 0,
    name: ''
  },
  logged: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.logged = true
    }
  },
  extraReducers(builder) {
    builder.addCase(getUserInfo.fulfilled, (state, { payload }) => {
      return {
        ...state,
        logged: true,
        user: payload
      }
    })
  },
})

export const { setUserInfo } = userSlice.actions

export default userSlice.reducer