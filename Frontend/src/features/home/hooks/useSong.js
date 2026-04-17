import { useContext } from "react";
import { SongContext } from "../context/song.context";
import { getSong } from "../api/song.api.js";
export const useSong = () => {
  const context = useContext(SongContext);

  const { song, setSong, loading, setLoading } = context;

  const getSongHandler = async ({ mood }) => {
    setLoading(true);

    try {
      const data = await getSong({ mood });
      setSong(data);
      return data;
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return { getSongHandler, song, loading };
};
