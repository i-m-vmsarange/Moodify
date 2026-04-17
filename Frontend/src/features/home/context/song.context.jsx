import { createContext, useState } from "react";

export const SongContext = createContext();

export const SongProvider = ({ children }) => {
  const [song, setSong] = useState({
    songUrl:
      "https://ik.imagekit.io/vmsarange/cohort2/moodify/songs/Miwaa_O9kHJTdRR.mpeg",
    posterUrl:
      "https://ik.imagekit.io/vmsarange/cohort2/moodify/posters/_Mitwa_TYjP2Axow",
    songTitle: "Mitwa",
    mood: "neutral",
  });

  const [loading, setLoading] = useState(false);

  return (
    <SongContext.Provider value={{ loading, setLoading, song, setSong }}>
      {children}
    </SongContext.Provider>
  );
};
