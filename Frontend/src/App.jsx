import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import { AuthProvider } from "./features/auth/context/auth.context";
import { SongProvider } from "./features/home/context/song.context";
function App() {
  return (
    <AuthProvider>
      <SongProvider>
        <RouterProvider router={router}></RouterProvider>
      </SongProvider>
    </AuthProvider>
  );
}

export default App;
