import { createSlice, createAsyncThunk, createEntityAdapter, configureStore } from '@reduxjs/toolkit';

const usersAdapter = createEntityAdapter({
  selectId: (user) => user.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const initialState = usersAdapter.getInitialState({
  loading: false,
  error: null,
});

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await fetch('URL_ს აქ');
  const data = await response.json();
  return data;
});

export const addUser = createAsyncThunk('users/addUser', async (user) => {
  const response = await fetch('URL_ს აქ', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  const data = await response.json();
  return data;
});

export const removeUser = createAsyncThunk('users/removeUser', async (userId) => {
  const response = await fetch(`URL_ს აქ/${userId}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  return data;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        usersAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        usersAdapter.addOne(state, action.payload);
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        usersAdapter.removeOne(state, action.payload.id);
      });
  },
});

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state) => state.users);

export const { reducer: usersReducer } = usersSlice;

export const store = configureStore({
  reducer: {
    users: usersReducer,
  },
});

// აპლიკაციის სტორიდან მომხმარებლების წამოღების განხილულება
console.log(selectAllUsers(store.getState()));

// მომხმარებლის წამოღების რექვესთის განხილულება
store.dispatch(fetchUsers()).then(() => {
  console.log(selectAllUsers(store.getState()));
});

// მომხმარებლის დამატების რექვესთის განხილულება
const newUser = { id: 1, name: 'New User' };
store.dispatch(addUser(newUser)).then(() => {
  console.log(selectAllUsers(store.getState()));
});

// მომხმარებლის წაშლის რექვესთის განხილულება
const userId = 1; // წასაშლელი მომხმარებლის ID
store.dispatch(removeUser(userId)).then(() => {
  console.log(selectAllUsers(store.getState()));
});
