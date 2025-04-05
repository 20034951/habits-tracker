import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchHabits, addHabit, markHabitAsDone } from './habitApi';

type Habit = {
    _id: string;
    title: string;
    description: string;
    days: number;
    createdAt: string;
    startedAt: string;
    lastUpdate: string;
    lastDone: string;
    userId: number;
}

type MarkHabitAsDoneParams = {
    id: string,
    token: string
}

type AddHabitParams = {
    token: string,
    title: string,
    description: string
}

type HabitState = {
    habits: Habit[];
    status: Record<string, 'idle' | 'loading' | 'success' | 'failed'>;
    error: Record<string, string | null>;

}

const initialState: HabitState = {
    habits: [],
    status: {},
    error: {}
}

export const fetchHabitsThunk = createAsyncThunk('habit/fetchHabits', async (token : string) => {
    const response = await fetchHabits(token);
    console.log(`response fetchHabitsThunk habitSlice ->  ${response}`);
    return response;
});

export const addHabitThunk = createAsyncThunk('habit/addHabit', async ({token, title, description} : AddHabitParams, { rejectWithValue }) => {
    try{
        const response = await addHabit(token, title, description);
        console.log(`response addHabitThunk habitSlice ->  ${response}`);
        
        if(response.error === 'Error creating habit, access denied'){
            return rejectWithValue(response.error);
        }

        return response;
    }catch(error){
        return rejectWithValue('Failed to create habit');
    }    
});

export const markAsDoneThunk = createAsyncThunk('habit/done', async ({id, token} : MarkHabitAsDoneParams, { rejectWithValue }) => {
    try{
        const response = await markHabitAsDone(id, token);
        console.log(`response markAsDoneThunk  habitSlice ->  ${response}`);

        if(response.message === "Habit restarted"){
            return response.message;    
        }

        return rejectWithValue(response.message);
    }catch(error){
        return rejectWithValue('Failed to mark habit as done');
    }    
});

export const calculateProgress = (days: number): string => {
    const progress = Math.min((days / 66) * 100, 100);
    return `${progress.toFixed(2)}%`;
}

const timeDifferenceInDays = (date1: any, date2: any) => {
    const differenceMS = Math.abs(date1 - date2);
    return Math.floor(differenceMS / (1000 * 3600 * 24));
  }

export const isDoneDisabled = (lastUpdate: string): boolean => {
    const todayDate = new Date();
    const lastUpdatedDate = new Date(lastUpdate);
    const disabled = timeDifferenceInDays(todayDate, lastUpdatedDate) === 0;
    console.log(`todayDate = ${todayDate} | lastUpdatedDate = ${lastUpdatedDate} | isDisabled = ${disabled}`);
    return disabled;
}

const habitSlice = createSlice({
    name: 'habits',
    initialState,
    reducers: {
        getHabits: (state, action) => {
            state.habits = action.payload;
        },
        createHabit: (state, action) => {
            state.habits.push(action.payload);
        },
        removeHabit: (state, action) => {
            state.habits = state.habits.filter(habit => habit._id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchHabitsThunk.fulfilled, (state, action) => {
            state.habits = action.payload;
        })
        .addCase(markAsDoneThunk.fulfilled, (state, action) => {
            state.status[action.meta.arg.id] = 'success';
            state.error[action.meta.arg.id] = null;
        })
        .addCase(markAsDoneThunk.rejected, (state, action) => {
            state.status[action.meta.arg.id] = 'failed';
            state.error[action.meta.arg.id] = action.payload as string;
        })
        .addCase(addHabitThunk.fulfilled, (state, action) => {
            state.habits.push(action.payload);
        })
    }
});

export const { getHabits, createHabit, removeHabit } = habitSlice.actions;
export default habitSlice.reducer;
