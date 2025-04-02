import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { registerUser, loginUser } from "./userApi";

type User = {
    _id: string;
    username: string;
    password: string;
    cratedAt: string;
}

interface userThunk {
    username: string;
    password: string;
}

type user = {
    token: string;
}

type userState = {
    user: user | null;
    status: 'idle' | 'loading' | 'success' | 'failed';
    error: string | null;
}

const initialState : userState = {
    user: null,
    status: 'idle',
    error: null
}

export const registerUserThunk = createAsyncThunk('user/registerUser', async ({username, password} : userThunk, {rejectWithValue}) => {
    try{
        const response = await registerUser(username, password);
        console.log(`response registerUserThunk userSlice -> ${response}`);

        if(response.message === 'User successfully registered'){
            return response.message;
        }else{
            rejectWithValue(response.error);
        }
    }catch(error){
        const errorResponse = `Failed to register user => ${error}`;
        console.error(errorResponse);
        rejectWithValue(errorResponse);
    }
});

export const loginUserThunk = createAsyncThunk('user/loginUser', async ({username, password} : userThunk, {rejectWithValue}) => {
    try{
        const response = await loginUser(username, password);
        console.log(`response loginUserThunk userSlice -> ${response}`);

        if(response.message === 'Login successful'){
            return response;
        }else{
            rejectWithValue(response.error);
        }
    }catch(err){
        
        console.log(`Failed to login -> ${err}`);
        rejectWithValue('Failed to login');
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.user = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUserThunk.fulfilled, (state, action) => {
                state.status = 'success';
                state.user = null;
                state.error = action.payload as string;
            })
            .addCase(registerUserThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.user = null;
                state.error = action.payload as string;
            })
            .addCase(loginUserThunk.fulfilled, (state, action) => {
                state.status = 'success';
                state.user = action.payload;
                state.error = action.payload as string;
            })
            .addCase(loginUserThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.user = null;
                state.error = action.payload as string;
            })
    }
});

export const { addUser } = userSlice.actions;
export default userSlice.reducer;
