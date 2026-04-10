import { useContext } from "react";
import { register, login, getMe, logOut } from "../services/auth.api.js";
import { AuthContext } from "../context/auth.context";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  async function handleRegister({ username, password }) {
    try {
      setLoading(true);
      const data = await register({ username, email, password });
      setUser(data.user);
      return data;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }
  async function handleLogin({ username, email, password }) {
    setLoading(true);
    try {
      const data = await login({ username, email, password });
      setUser(data.user);
      return data;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }
  async function handleGetMe() {
    setLoading(true);
    try {
      const data = await getMe();
      setUser(data.user);
      return data;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }
  async function handleLogout() {
    setLoading(true);
    try {
      const data = await logOut();
      setUser(null);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout,
    user,
    loading,
  };
};
