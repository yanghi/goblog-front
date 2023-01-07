import { getLocalUser } from './../../utils/storage';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../../service/user";
import { User } from "../../struct/user";

export const getUserInfo = createAsyncThunk<User>('user/userinfo', async () => {
  let local = getLocalUser()

  if (local) return local
  let res = await userService.getUserInfo()

  return res.data.data
});
